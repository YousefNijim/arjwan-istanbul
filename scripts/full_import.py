"""
Full PDF import using x-coordinate based column detection.
Groups words by row (same 'top' y-position), identifies 3 columns by x ranges,
reconstructs "Name Brand $price" entries, matches Fragrantica CSV, inserts to DB.
"""
import csv, json, re, sys, io, ast, subprocess
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

for pkg in ['pdfplumber', 'psycopg2-binary']:
    try:
        __import__(pkg.replace('-binary','').replace('-','_'))
    except ImportError:
        subprocess.check_call([sys.executable,'-m','pip','install',pkg,'-q'])

import pdfplumber, psycopg2

DATABASE_URL = "postgresql://postgres.zsdlifnvprnadznustgt:WLlXnzs9q0JV4ukX@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
IMAGE_URL    = "https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/WhatsApp%20Image%202026-04-23%20at%2011.38.04.jpeg"
PDF_PATH     = r'C:\Users\yosef\Downloads\arjwan-istanbul\1.Top Kalite.pdf'
CSV_PATH     = r'C:\Users\yosef\Downloads\arjwan-istanbul\fra_perfumes.csv'

SKIP_WORDS = {'07/04/2026','GSM:','info@zahrakozmetik.com','Top','Kalite',
              'O.S.B','Mah.','SİTESİ','BLK.','BAŞAKŞEHİR','İSTANBUL.',
              'Mutfakçılar','M3,','No.37','İKİTELLİ','((PAGE','1','2','3',
              'OF','3))','2))','1))','ERKEK','/','MEN','PERFUMES','/1.',
              'KALITE','BAYAN','WOMEN','UNISEX','ORINTAL','ORIENTAL',
              'ÇOCUK','KIDS','لولأا','عونلا','-','Top','Kalite',
              '0553','880','6169','2026'}

SKIP_NAMES = {'batman','mickey mouse','cinderella','fulla','spiderman',
              'hamol kids','strawberry','kavun','apricot','berry dut',
              'chocolate','coconut','fruits','green tea','menthol',
              'peach','tulip lale','mlbes','misk meka','bakhur',
              'doaa al janneh','tutti frutti','vanilya','misk karbala',
              'al janneh birds','zafet al aaros','peach şeftali',
              'viva di tosca','johnson','baby','gardenia zara',
              'chai','sabun','misk meka','misk taharat',
              'misk powder','misk fresh','misk bal','misk rose',
              'anber','apricot','vanilla ','red gori',}

def get_price(cost):
    if cost < 70:    return (360, 600)
    elif cost < 130: return (500, 750)
    elif cost < 145: return (550, 820)
    elif cost < 200: return (750, 1000)
    elif cost < 250: return (880, 1130)
    else:            return (880, 1200)

def make_id(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:80]

def parse_notes(desc):
    top = mid = base = ''
    m = re.search(r'[Tt]op notes? (?:are|is) ([^;\.]{3,200})', desc)
    if m: top = m.group(1).strip()
    m = re.search(r'[Mm]iddle notes? (?:are|is) ([^;\.]{3,200})', desc)
    if m: mid = m.group(1).strip()
    m = re.search(r'[Bb]ase notes? (?:are|is) ([^;\.]{3,200})', desc)
    if m: base = m.group(1).strip()
    return top[:400], mid[:400], base[:400]

def clean_desc(raw):
    d = re.sub(r'^.+? is an? [^.]+?fragrance for [^.]+?\.', '', raw).strip()
    d = re.sub(r'.+?was launched in \d{4}\.\s*', '', d).strip()
    if len(d) < 20: d = raw
    if len(d) > 500: d = d[:500].rsplit(' ',1)[0] + '...'
    return d.strip()

def parse_accords(s):
    try: return ast.literal_eval(s)[:5]
    except: return []

# ── Load Fragrantica ─────────────────────────────────────────────────────────
fra_data = {}
with open(CSV_PATH, encoding='utf-8', errors='replace') as f:
    for row in csv.DictReader(f):
        fra_data[row['Name'].strip().lower()] = row

def find_fra(name):
    nl = name.lower()
    if nl in fra_data: return fra_data[nl]
    for k,v in fra_data.items():
        if k.startswith(nl+' ') or k == nl: return v
    words = nl.split()
    if len(words) >= 2:
        prefix = ' '.join(words[:2])
        for k,v in fra_data.items():
            if k.startswith(prefix): return v
    return None

# ── Parse PDF by word x-positions ───────────────────────────────────────────
all_entries = []  # (raw_text, cost, category)
current_category = 'men'

PRICE_RE = re.compile(r'^\$(\d+)$')

with pdfplumber.open(PDF_PATH) as pdf:
    for page_num, page in enumerate(pdf.pages):
        words = page.extract_words(keep_blank_chars=False, x_tolerance=3, y_tolerance=3)
        if not words: continue

        # Determine page width → split into 3 column thirds
        page_w = page.width
        col_bounds = [(0, page_w/3), (page_w/3, 2*page_w/3), (2*page_w/3, page_w)]

        # Check for category header in first few words
        header_text = ' '.join(w['text'] for w in words[:40]).upper()
        if 'ERKEK' in header_text or 'MEN PERFUME' in header_text:
            current_category = 'men'
        elif 'BAYAN' in header_text or 'WOMEN PERFUME' in header_text:
            current_category = 'women'
        elif 'UNISEX' in header_text or 'ORINTAL' in header_text:
            current_category = 'women'  # unisex → we'll set women, can be changed
        elif 'KIDS' in header_text or 'ÇOCUK' in header_text:
            current_category = None  # skip

        if current_category is None:
            continue

        # Group words by row (same y ± 2pt)
        rows_dict = {}
        for w in words:
            if w['text'] in SKIP_WORDS: continue
            row_key = round(w['top'] / 3) * 3  # bucket by ~3pt
            if row_key not in rows_dict:
                rows_dict[row_key] = []
            rows_dict[row_key].append(w)

        # Skip header rows (top ~25% of page)
        header_cutoff = page.height * 0.22
        data_rows = {k: v for k, v in rows_dict.items() if k > header_cutoff}

        for row_y in sorted(data_rows.keys()):
            row_words = sorted(data_rows[row_y], key=lambda w: w['x0'])

            # Assign each word to column 0,1,2
            cols = {0: [], 1: [], 2: []}
            for w in row_words:
                cx = (w['x0'] + w['x1']) / 2
                for ci, (lo, hi) in enumerate(col_bounds):
                    if lo <= cx < hi:
                        cols[ci].append(w['text'])
                        break

            # Each column should end with $price
            for ci in range(3):
                cell_words = cols[ci]
                if not cell_words: continue
                # Find $price token
                price_idx = None
                for i, tok in enumerate(cell_words):
                    if PRICE_RE.match(tok):
                        price_idx = i
                        break
                if price_idx is None: continue

                cost_str = cell_words[price_idx][1:]  # strip $
                try:
                    cost = int(cost_str)
                except:
                    continue

                if cost < 40: continue  # skip trivial items

                name_tokens = cell_words[:price_idx]
                if not name_tokens: continue
                name = ' '.join(name_tokens).strip()

                # Skip header leftovers and SKIP_NAMES
                if len(name) < 3: continue
                name_low = name.lower()
                if any(s in name_low for s in SKIP_NAMES): continue
                if re.match(r'^\d', name): continue  # starts with digit

                all_entries.append((name, cost, current_category))

print(f"Extracted {len(all_entries)} entries from PDF")

# ── Deduplicate and build products ───────────────────────────────────────────
products = []
seen_ids = set()

for (name, cost, category) in all_entries:
    pid = make_id(name)
    if pid in seen_ids:
        continue
    seen_ids.add(pid)

    p50, p100 = get_price(cost)
    fra = find_fra(name)

    if fra and fra.get('Description','').strip():
        raw  = fra['Description']
        desc = clean_desc(raw)
        top, mid, base = parse_notes(raw)
        accords = parse_accords(fra.get('Main Accords','[]'))
        if len(desc) < 20:
            desc = f"A captivating fragrance with {', '.join(accords[:3])} character."
        gender_fra = fra.get('Gender','').lower()
        if 'for men' in gender_fra and 'women' not in gender_fra:
            category = 'men'
        elif 'for women' in gender_fra and 'men' not in gender_fra:
            category = 'women'
    else:
        desc  = f"A captivating fragrance crafted with exceptional ingredients for a memorable experience."
        top = mid = base = ''

    products.append({
        'id': pid, 'name': name,
        'desc': desc[:2000], 'top': top, 'mid': mid, 'base': base,
        'category': category, 'p50': p50, 'p100': p100, 'cost': cost,
    })

print(f"Built {len(products)} unique products")

# ── Bulk insert ──────────────────────────────────────────────────────────────
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
ON CONFLICT (id) DO UPDATE SET
    name_en=EXCLUDED.name_en, name_ar=EXCLUDED.name_ar, name_tr=EXCLUDED.name_tr,
    description_en=EXCLUDED.description_en, description_ar=EXCLUDED.description_ar,
    description_tr=EXCLUDED.description_tr,
    category=EXCLUDED.category, price_50ml=EXCLUDED.price_50ml, price_100ml=EXCLUDED.price_100ml,
    image_url=EXCLUDED.image_url, inspired_by=EXCLUDED.inspired_by,
    original_perfume=EXCLUDED.original_perfume,
    notes_top_en=EXCLUDED.notes_top_en, notes_top_ar=EXCLUDED.notes_top_ar, notes_top_tr=EXCLUDED.notes_top_tr,
    notes_middle_en=EXCLUDED.notes_middle_en, notes_middle_ar=EXCLUDED.notes_middle_ar,
    notes_middle_tr=EXCLUDED.notes_middle_tr,
    notes_base_en=EXCLUDED.notes_base_en, notes_base_ar=EXCLUDED.notes_base_ar,
    notes_base_tr=EXCLUDED.notes_base_tr,
    featured=EXCLUDED.featured, active=EXCLUDED.active, updated_at=NOW();
"""

conn = psycopg2.connect(DATABASE_URL)
cur  = conn.cursor()
inserted = skipped = 0

for p in products:
    n = p['name'][:200]
    try:
        cur.execute(SQL, (
            p['id'], n, n, n,
            p['desc'], p['desc'], p['desc'],
            p['category'], p['p50'], p['p100'], IMAGE_URL,
            '', n.upper(),
            p['top'], p['top'], p['top'],
            p['mid'], p['mid'], p['mid'],
            p['base'], p['base'], p['base'],
            False, True, 0,
        ))
        inserted += 1
    except Exception as e:
        print(f"  SKIP {p['id']}: {e}")
        conn.rollback()
        skipped += 1

conn.commit(); cur.close(); conn.close()
print(f"\n✅ Done: {inserted} inserted/updated, {skipped} skipped")

# Save summary
with open('scripts/full_import_summary.json', 'w', encoding='utf-8') as f:
    json.dump([{'id': p['id'], 'name': p['name'], 'cost': p['cost'],
                'p50': p['p50'], 'p100': p['p100'], 'cat': p['category']}
               for p in products], f, ensure_ascii=False, indent=2)
print(f"Summary → scripts/full_import_summary.json")
