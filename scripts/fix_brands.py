"""
Extract brand from Fragrantica CSV and update inspired_by for all perfumes in DB.
Strategy:
1. For each product, look up its name_en in Fragrantica.
   The Fra CSV Name field is like "Bleu de Chanel Chanel for men" - brand is between name and "for".
2. Fallback: try to infer brand from known brand list matched against the name_en suffix.
"""
import csv, sys, io, re, psycopg2
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATABASE_URL = "postgresql://postgres.zsdlifnvprnadznustgt:WLlXnzs9q0JV4ukX@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
CSV_PATH     = r'C:\Users\yosef\Downloads\arjwan-istanbul\fra_perfumes.csv'

# ── Load Fragrantica — build name→brand map ──────────────────────────────────
# Fra Name format: "Perfume Name Brand for gender"
# Extract brand as the token(s) between perfume-name-end and "for "
fra_brands = {}  # perfume_name_lower → brand
fra_rows   = {}  # perfume_name_lower → full row

with open(CSV_PATH, encoding='utf-8', errors='replace') as f:
    for row in csv.DictReader(f):
        full = row['Name'].strip()
        gender_part = row['Gender'].strip()  # e.g. "for men"
        # Remove gender suffix
        name_no_gender = full
        if gender_part and gender_part in full:
            name_no_gender = full[:full.rfind(gender_part)].strip()
        fra_rows[full.lower()] = row

        # Try to extract brand using URL pattern: /perfume/Brand/Perfume-Name-id.html
        url = row.get('url', '')
        m = re.search(r'/perfume/([^/]+)/', url)
        if m:
            brand = m.group(1).replace('-', ' ').replace('_', ' ').strip()
            fra_brands[full.lower()] = brand

print(f"Loaded {len(fra_brands)} brand mappings from Fragrantica")

# ── Known brand list for fallback suffix matching ────────────────────────────
KNOWN_BRANDS = [
    'Paco Rabanne', 'Carolina Herrera', 'Chanel', 'Giorgio Armani', 'Armani',
    'Hugo Boss', 'Dior', 'Christian Dior', 'Versace', 'Jean Paul Gaultier',
    'Yves Saint Laurent', 'YSL', 'Tom Ford', 'Hermes', 'Hermès', 'Creed',
    'Prada', 'Nishane', 'Guerlain', 'Parfums de Marly', 'Bvlgari', 'Bulgari',
    'Dolce Gabbana', 'Dolce & Gabbana', 'Givenchy', 'Viktor Rolf', 'Viktor&Rolf',
    'Montblanc', 'Ralph Lauren', 'Azzaro', 'Davidoff', 'Cartier', 'Kenzo',
    'Joop', 'Burberry', 'Issey Miyake', 'Valentino', 'Marc-Antoine Barrois',
    'Louis Vuitton', 'Escentric Molecules', 'Lancome', 'Lancôme', 'Gucci',
    'Chloe', 'Chloé', 'By Kilian', 'Kilian', 'Lanvin', 'Nina Ricci',
    'Calvin Klein', 'Mugler', 'Thierry Mugler', 'Narciso Rodriguez', 'Elie Saab',
    'Victoria Secret', "Victoria's Secret", 'Estee Lauder', 'Parfums de Marly',
    'Initio', 'Penhaligon', "Penhaligon's", 'Maison Margiela', 'Byredo',
    'Mancera', 'Tiziana Terenzi', 'Lattafa', 'Montale', 'Memo Paris',
    'Xerjoff', 'Kayali', 'Essential Parfums', 'Maison Francis Kurkdjian',
    'Rasasi', 'Arabian Oud', 'Ajmal', 'Nasomatto', 'Amouage', 'Orto Parisi',
    'Sospiro', 'Ex Nihilo', 'Chopard', 'Anna Sui', 'Ariana Grande',
    'Aquolina', 'Avon', 'Britney Spears', 'Lacoste', 'Diesel', 'Bentley',
    'Jaguar', 'Hugo', 'Alfred Dunhill', 'Dunhill', 'Rochas', 'Moschino',
    'Givenchy', 'Revlon', 'Escada', 'Cacharel', 'Loewe', 'Roberto Cavalli',
    'Dsquared', 'Bogner', 'Paris Hilton', 'Marc Jacobs', 'Gissah', 'Gisada',
    'Attar Collection', 'Penhaligon', 'Swiss Arabian', 'Al Haramain',
    'Vertus', 'Maison Crivelli', 'Ormonde Jayne',
]
# Sort longest first so "Maison Francis Kurkdjian" beats "Maison"
KNOWN_BRANDS.sort(key=lambda x: -len(x))

def infer_brand_from_name(name_en):
    """Try to find a known brand as a suffix of the product name."""
    n = name_en.strip()
    n_lower = n.lower()
    for brand in KNOWN_BRANDS:
        if n_lower.endswith(brand.lower()):
            return brand
        if brand.lower() in n_lower:
            return brand
    return ''

def find_brand(name_en):
    n_lower = name_en.lower()
    # 1. Exact match in fra_brands
    for k, brand in fra_brands.items():
        if k.startswith(n_lower + ' ') or k == n_lower:
            return brand
    # 2. First two words match
    words = n_lower.split()
    if len(words) >= 2:
        prefix = ' '.join(words[:2])
        for k, brand in fra_brands.items():
            if k.startswith(prefix):
                return brand
    # 3. Known brand suffix
    return infer_brand_from_name(name_en)

# ── Connect and update all products ─────────────────────────────────────────
conn = psycopg2.connect(DATABASE_URL)
cur  = conn.cursor()

cur.execute("SELECT id, name_en, original_perfume, inspired_by FROM perfumes")
products = cur.fetchall()

updated = no_brand = 0

for (pid, name_en, orig, current_brand) in products:
    brand = find_brand(name_en)
    if not brand:
        brand = find_brand(orig)  # try original perfume field too
    
    if brand:
        # Also clean up name_en: strip brand suffix if it's appended
        clean_name = name_en
        brand_lower = brand.lower()
        if clean_name.lower().endswith(brand_lower):
            clean_name = clean_name[:len(clean_name)-len(brand)].strip().strip('-').strip()
        
        cur.execute(
            "UPDATE perfumes SET inspired_by=%s, name_en=%s, name_ar=%s, name_tr=%s, original_perfume=%s, updated_at=NOW() WHERE id=%s",
            (brand, clean_name, clean_name, clean_name, clean_name.upper(), pid)
        )
        updated += 1
    else:
        no_brand += 1
        # Still try to clean name from common patterns  
        # e.g. "1 Million Elixir Paco Rabanne" → keep as is

conn.commit()
cur.close()
conn.close()

print(f"✅ Updated brands: {updated} products")
print(f"⚠️  No brand found: {no_brand} products")
