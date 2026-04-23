"""
CLEAN REBUILD:
1. Delete ALL existing perfumes from DB
2. Parse PDF: pages 1-3 = men, 4-6 = women, 7-8 = unisex (stored as 'men'/'women')
3. Skip kids section (end of page 8)
4. Deduplicate by perfume name (lowercase)
5. Match Fragrantica CSV for description + notes
6. Apply pricing tiers
7. Translate descriptions to Arabic & Turkish
8. Bulk insert
"""
import csv, json, re, sys, io, ast, time, psycopg2
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

try:
    import pdfplumber
except ImportError:
    import subprocess; subprocess.check_call([sys.executable,'-m','pip','install','pdfplumber','-q'])
    import pdfplumber

try:
    from deep_translator import GoogleTranslator
    CAN_TRANSLATE = True
except ImportError:
    CAN_TRANSLATE = False
    print("deep_translator not available – descriptions will be English only")

DATABASE_URL = "postgresql://postgres.zsdlifnvprnadznustgt:WLlXnzs9q0JV4ukX@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
IMAGE_URL    = "https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/WhatsApp%20Image%202026-04-23%20at%2011.38.04.jpeg"
PDF_PATH     = r'C:\Users\yosef\Downloads\arjwan-istanbul\1.Top Kalite.pdf'
CSV_PATH     = r'C:\Users\yosef\Downloads\arjwan-istanbul\fra_perfumes.csv'

# ── Page → category map (1-indexed) ─────────────────────────────────────────
# Pages 1-3 = men, 4-6 = women, 7-8 = unisex → map to 'men'/'women'
# Kids section at end of page 8 → skip
def page_to_category(page_num):   # 0-indexed internally
    p = page_num + 1              # make 1-indexed
    if 1 <= p <= 3: return 'men'
    if 4 <= p <= 6: return 'women'
    if 7 <= p <= 8: return 'women'  # unisex → women (or pick 'men', user can edit)
    return None

# ── Pricing tiers ────────────────────────────────────────────────────────────
def get_price(cost):
    if cost < 70:    return (360, 600)
    elif cost < 130: return (500, 750)
    elif cost < 145: return (550, 820)
    elif cost < 200: return (750, 1000)
    elif cost < 250: return (880, 1130)
    else:            return (880, 1200)

# ── Helpers ──────────────────────────────────────────────────────────────────
def make_id(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:80]

def parse_notes(desc):
    top = mid = base = ''
    m = re.search(r'[Tt]op notes? (?:are|is) ([^;\.]{3,300})', desc)
    if m: top = m.group(1).strip().rstrip('.')
    m = re.search(r'[Mm]iddle notes? (?:are|is) ([^;\.]{3,300})', desc)
    if m: mid = m.group(1).strip().rstrip('.')
    m = re.search(r'[Bb]ase notes? (?:are|is) ([^;\.]{3,300})', desc)
    if m: base = m.group(1).strip().rstrip('.')
    return top[:400], mid[:400], base[:400]

def clean_desc(raw):
    d = re.sub(r'^.+?is an? [^.]+?fragrance for [^.]+?\.', '', raw).strip()
    d = re.sub(r'^.+?was launched in \d{4}\.?\s*', '', d).strip()
    if len(d) < 20: d = raw
    # Truncate at end of base notes sentence if possible
    m = re.search(r'base notes? (?:are|is)[^\.]+\.', d, re.IGNORECASE)
    if m: d = d[:m.end()].strip()
    if len(d) > 500: d = d[:500].rsplit(' ', 1)[0] + '...'
    return d.strip()

def parse_accords(s):
    try: return ast.literal_eval(s)[:5]
    except: return []

def safe_translate(text, translator, retries=2):
    if not text or not text.strip(): return text
    for attempt in range(retries):
        try:
            result = translator.translate(text[:4500])
            time.sleep(0.12)
            return result or text
        except:
            time.sleep(1.5 * (attempt + 1))
    return text

# ── Load Fragrantica CSV ──────────────────────────────────────────────────────
print("Loading Fragrantica CSV...", flush=True)
fra_data = {}   # lower_name → row
fra_brand = {}  # lower_name → brand (from URL)
with open(CSV_PATH, encoding='utf-8', errors='replace') as f:
    for row in csv.DictReader(f):
        key = row['Name'].strip().lower()
        fra_data[key] = row
        url = row.get('url','')
        m = re.search(r'/perfume/([^/]+)/', url)
        if m:
            fra_brand[key] = m.group(1).replace('-',' ').replace('_',' ').strip()

print(f"Loaded {len(fra_data)} Fragrantica entries")

def find_fra(name):
    nl = name.lower()
    if nl in fra_data: return fra_data[nl], fra_brand.get(nl,'')
    # prefix match
    for k,v in fra_data.items():
        if k.startswith(nl+' ') or k == nl:
            return v, fra_brand.get(k,'')
    # first-two-words match
    words = nl.split()
    if len(words) >= 2:
        prefix = ' '.join(words[:2])
        for k,v in fra_data.items():
            if k.startswith(prefix):
                return v, fra_brand.get(k,'')
    return None, ''

# Known brand suffixes for extraction
KNOWN_BRANDS = sorted([
    'Paco Rabanne','Carolina Herrera','Chanel','Giorgio Armani','Armani',
    'Hugo Boss','Dior','Christian Dior','Versace','Jean Paul Gaultier',
    'Yves Saint Laurent','YSL','Tom Ford','Hermes','Creed','Prada',
    'Nishane','Guerlain','Parfums de Marly','Bvlgari','Dolce Gabbana',
    'Dolce & Gabbana','Givenchy','Viktor Rolf','Viktor&Rolf','Montblanc',
    'Ralph Lauren','Azzaro','Davidoff','Cartier','Kenzo','Joop','Burberry',
    'Issey Miyake','Valentino','Marc-Antoine Barrois','Louis Vuitton',
    'Escentric Molecules','Lancome','Gucci','Chloe','By Kilian','Kilian',
    'Lanvin','Nina Ricci','Calvin Klein','Mugler','Narciso Rodriguez',
    'Elie Saab','Estee Lauder','Initio','Penhaligon','Maison Margiela',
    'Byredo','Mancera','Tiziana Terenzi','Lattafa','Montale','Memo Paris',
    'Xerjoff','Kayali','Essential Parfums','Maison Francis Kurkdjian',
    'Rasasi','Arabian Oud','Ajmal','Nasomatto','Amouage','Orto Parisi',
    'Sospiro','Ex Nihilo','Chopard','Anna Sui','Ariana Grande','Aquolina',
    'Avon','Britney Spears','Lacoste','Diesel','Bentley','Alfred Dunhill',
    'Dunhill','Rochas','Moschino','Revlon','Escada','Cacharel','Loewe',
    'Roberto Cavalli','Paris Hilton','Marc Jacobs','Gisada','Swiss Arabian',
    'Al Haramain','Vertus','Ormonde Jayne','Milton Lloyd','Jequiti',
    'Remy Latour','Guy Laroche','Bogner','Mirato','Lucky Brand','Dsquared',
    'Antonio Banderas','Costume National','Nikos','Jacques Bogart',
    'Laura Biagiotti','Gianfranco Ferre','Jaguar','Hummer','Adidas',
    'Hugo','Ted Lapidus','Lapidus','Sergio Tacchini','Bath Body Works',
    'Victoria Secret',"Victoria's Secret",'Aramis','Ted Lapidus',
], key=lambda x: -len(x))

def extract_brand(name_raw):
    nl = name_raw.lower()
    for b in KNOWN_BRANDS:
        if nl.endswith(b.lower()):
            clean = name_raw[:len(name_raw)-len(b)].strip().strip('-').strip()
            return clean, b
        if b.lower() in nl:
            return name_raw, b
    return name_raw, ''

# ── Words to skip (header/footer lines) ─────────────────────────────────────
SKIP_WORDS = {
    '07/04/2026','gsm:','info@zahrakozmetik.com','top','kalite',
    'o.s.b','mah.','sitesi','blk.','başakşehir','istanbul.',
    'mutfakçılar','m3,','no.37','ikitelli','((page','1','2','3',
    'of','3))','2))','1))','erkek','/','men','perfumes','/1.',
    'bayan','women','unisex','orintal','oriental','çocuk','kids',
    'لولأا','عونلا','-','0553','880','6169','2026','page'
}

# Items to skip entirely
SKIP_NAMES_PARTIAL = [
    'batman','mickey mouse','cinderella','fulla','spiderman','hamol kids',
    'al janneh birds','zafet al aaros','misk taharat','misk meka',
    'misk karbala','misk powder','misk bal','misk rose','misk fresh',
    'misk laylaki','misk melaki','misk nar','misk shahrazad',
    'misk taharat','doaa al janneh','tutti frutti','vanilya',
    'mlbes','bakhur','kavun','apricot kayisi','peach seftali',
    'tulip lale','ward','isparta gul','gori rose','türk gül',
    'türk gul','nesim aksa','nesim bahr','nibras','titanum',
    'viva di tosca','johnson','johnson baby','gardenia zara',
    'chai','sabun','dove sabun','anber','golden kashkha',
    'fl beyaz','misk oud diplomatic','misk powder','classical',
    'mlbes sekerleme','sultan fatih','yavuz sultan selim',
    'quraish','harim sultan','makam ibrahim','zenbak',
    'resala arabian','doaa al','al kaaba','al amaken',
    'al wisam','al haitham','faqat lil rijal','kahir al nissaa',
    'kahir al rijal','busaina','entebaa','entebaa w',
]

PRICE_RE = re.compile(r'\$(\d+)$')

# ── Parse PDF ────────────────────────────────────────────────────────────────
print("Parsing PDF...", flush=True)
all_entries = []   # list of (raw_name, cost, category)

with pdfplumber.open(PDF_PATH) as pdf:
    for page_idx, page in enumerate(pdf.pages):
        category = page_to_category(page_idx)
        if category is None:
            continue

        words = page.extract_words(keep_blank_chars=False, x_tolerance=3, y_tolerance=3)
        if not words: continue

        page_w = page.width
        col_bounds = [(0, page_w/3), (page_w/3, 2*page_w/3), (2*page_w/3, page_w)]

        # Group words by row
        rows_dict = {}
        for w in words:
            if w['text'].lower() in SKIP_WORDS: continue
            if re.match(r'^\d{2}/\d{2}/\d{4}$', w['text']): continue
            row_key = round(w['top'] / 3) * 3
            rows_dict.setdefault(row_key, []).append(w)

        # Skip header rows (top 22% of page)
        header_cutoff = page.height * 0.22
        # Also skip kids section: if we see "KIDS" / "ÇOCUK" in this page → stop
        page_text = ' '.join(w['text'] for w in words).upper()
        is_kids_page = 'KIDS' in page_text or 'ÇOCUK' in page_text

        for row_y in sorted(rows_dict.keys()):
            if row_y <= header_cutoff: continue

            row_words = sorted(rows_dict[row_y], key=lambda w: w['x0'])

            # Assign words to columns
            cols = {0: [], 1: [], 2: []}
            for w in row_words:
                cx = (w['x0'] + w['x1']) / 2
                for ci, (lo, hi) in enumerate(col_bounds):
                    if lo <= cx < hi:
                        cols[ci].append(w['text'])
                        break

            for ci in range(3):
                cell_words = cols[ci]
                if not cell_words: continue

                # Find $price
                price_idx = None
                for i, tok in enumerate(cell_words):
                    if PRICE_RE.match(tok):
                        price_idx = i
                        break
                if price_idx is None: continue

                cost = int(cell_words[price_idx][1:])
                if cost < 40: continue  # skip trivial / musk powders

                name_tokens = cell_words[:price_idx]
                if not name_tokens: continue
                name = ' '.join(name_tokens).strip()
                if len(name) < 3: continue

                # Skip kids items even if on unisex page
                if is_kids_page and row_y > page.height * 0.7:
                    continue  # kids at bottom of page 8

                name_low = name.lower()
                if any(s in name_low for s in SKIP_NAMES_PARTIAL):
                    continue

                all_entries.append((name, cost, category))

print(f"Extracted {len(all_entries)} raw entries from PDF")

# ── Deduplicate: keep first occurrence per normalized name ───────────────────
seen_names = set()
unique_entries = []
for (name, cost, category) in all_entries:
    key = re.sub(r'[^a-z0-9]', '', name.lower())
    if key in seen_names:
        continue
    seen_names.add(key)
    unique_entries.append((name, cost, category))

print(f"After dedup: {len(unique_entries)} unique perfumes")

# ── Build product records ────────────────────────────────────────────────────
print("Matching Fragrantica data...", flush=True)
products = []
seen_ids = set()

for (name, cost, category) in unique_entries:
    # Try to split brand from name
    clean_name, brand = extract_brand(name)
    if not clean_name:
        clean_name = name
        brand = ''

    fra, fra_brand_url = find_fra(clean_name) or find_fra(name)
    if not fra:
        fra, fra_brand_url = None, ''
    if fra_brand_url and not brand:
        brand = fra_brand_url

    if fra and fra.get('Description','').strip():
        raw   = fra['Description']
        desc  = clean_desc(raw)
        top, mid, base = parse_notes(raw)
        accords = parse_accords(fra.get('Main Accords','[]'))
        gender_fra = fra.get('Gender','').lower()
        # Refine category from Fragrantica gender
        if 'for men' in gender_fra and 'women' not in gender_fra:
            category = 'men'
        elif 'for women' in gender_fra and 'men' not in gender_fra:
            category = 'women'
        if len(desc) < 20:
            desc = f"A captivating fragrance with {', '.join(accords[:3])} character, crafted for a lasting impression."
    else:
        desc = f"A captivating fragrance crafted with exceptional ingredients for a memorable experience."
        top = mid = base = ''

    pid = make_id(clean_name)
    if pid in seen_ids:
        pid = make_id(f"{clean_name}-{brand}") if brand else make_id(f"{clean_name}-{cost}")
    seen_ids.add(pid)

    p50, p100 = get_price(cost)
    products.append({
        'id': pid, 'name': clean_name, 'brand': brand,
        'desc': desc[:2000], 'top': top, 'mid': mid, 'base': base,
        'category': category, 'p50': p50, 'p100': p100,
    })

print(f"Built {len(products)} product records")

# ── Translate descriptions ────────────────────────────────────────────────────
if CAN_TRANSLATE:
    print("Translating to Arabic and Turkish...", flush=True)
    tr_ar = GoogleTranslator(source='en', target='ar')
    tr_tr = GoogleTranslator(source='en', target='tr')
    for i, p in enumerate(products):
        p['desc_ar'] = safe_translate(p['desc'], tr_ar)
        p['desc_tr'] = safe_translate(p['desc'], tr_tr)
        p['top_ar']  = safe_translate(p['top'],  tr_ar)
        p['top_tr']  = safe_translate(p['top'],  tr_tr)
        p['mid_ar']  = safe_translate(p['mid'],  tr_ar)
        p['mid_tr']  = safe_translate(p['mid'],  tr_tr)
        p['base_ar'] = safe_translate(p['base'], tr_ar)
        p['base_tr'] = safe_translate(p['base'], tr_tr)
        if (i+1) % 50 == 0:
            print(f"  Translated {i+1}/{len(products)}...", flush=True)
else:
    for p in products:
        p['desc_ar'] = p['desc']; p['desc_tr'] = p['desc']
        p['top_ar']  = p['top'];  p['top_tr']  = p['top']
        p['mid_ar']  = p['mid'];  p['mid_tr']  = p['mid']
        p['base_ar'] = p['base']; p['base_tr'] = p['base']

# ── Connect to DB — DELETE ALL then INSERT ────────────────────────────────────
print("Connecting to database...", flush=True)
conn = psycopg2.connect(DATABASE_URL)
cur  = conn.cursor()

print("Deleting all existing perfumes...", flush=True)
cur.execute("DELETE FROM perfumes")
conn.commit()
print("  ✅ All perfumes deleted")

SQL = """
INSERT INTO perfumes (
    id, name_ar, name_en, name_tr,
    description_ar, description_en, description_tr,
    category, price_50ml, price_100ml, image_url,
    inspired_by, original_perfume,
    notes_top_ar, notes_top_en, notes_top_tr,
    notes_middle_ar, notes_middle_en, notes_middle_tr,
    notes_base_ar, notes_base_en, notes_base_tr,
    featured, active, sort_order, created_at, updated_at
) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW(),NOW())
"""

inserted = errors = 0
for p in products:
    n = p['name'][:200]
    try:
        cur.execute(SQL, (
            p['id'], n, n, n,
            p['desc_ar'], p['desc'], p['desc_tr'],
            p['category'], p['p50'], p['p100'], IMAGE_URL,
            p['brand'][:200] if p['brand'] else '',
            n.upper(),
            p['top_ar'], p['top'], p['top_tr'],
            p['mid_ar'], p['mid'], p['mid_tr'],
            p['base_ar'], p['base'], p['base_tr'],
            False, True, 0,
        ))
        inserted += 1
    except Exception as e:
        print(f"  SKIP {p['id']}: {e}")
        conn.rollback()
        errors += 1

conn.commit()
cur.close()
conn.close()
print(f"\n✅ Complete: {inserted} inserted, {errors} errors")
print(f"Men: {sum(1 for p in products if p['category']=='men')}")
print(f"Women: {sum(1 for p in products if p['category']=='women')}")
