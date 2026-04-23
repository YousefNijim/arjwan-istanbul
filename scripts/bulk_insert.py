"""
Bulk-insert all generated perfumes directly into the Supabase PostgreSQL database.
Reads products_output.json produced by generate_products.py.
"""
import json, sys, re, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATABASE_URL = "postgresql://postgres.zsdlifnvprnadznustgt:WLlXnzs9q0JV4ukX@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

try:
    import psycopg2
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'psycopg2-binary', '-q'])
    import psycopg2

with open(r'scripts/products_output.json', encoding='utf-8-sig') as f:
    products = json.load(f)

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

INSERT_SQL = """
INSERT INTO perfumes (
    id, name_ar, name_en, name_tr,
    description_ar, description_en, description_tr,
    category, price_50ml, price_100ml,
    image_url, inspired_by, original_perfume,
    notes_top_ar, notes_top_en, notes_top_tr,
    notes_middle_ar, notes_middle_en, notes_middle_tr,
    notes_base_ar, notes_base_en, notes_base_tr,
    featured, active, sort_order,
    created_at, updated_at
) VALUES (
    %s, %s, %s, %s,
    %s, %s, %s,
    %s, %s, %s,
    %s, %s, %s,
    %s, %s, %s,
    %s, %s, %s,
    %s, %s, %s,
    %s, %s, %s,
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    name_tr = EXCLUDED.name_tr,
    description_ar = EXCLUDED.description_ar,
    description_en = EXCLUDED.description_en,
    description_tr = EXCLUDED.description_tr,
    category = EXCLUDED.category,
    price_50ml = EXCLUDED.price_50ml,
    price_100ml = EXCLUDED.price_100ml,
    image_url = EXCLUDED.image_url,
    inspired_by = EXCLUDED.inspired_by,
    original_perfume = EXCLUDED.original_perfume,
    notes_top_ar = EXCLUDED.notes_top_ar,
    notes_top_en = EXCLUDED.notes_top_en,
    notes_top_tr = EXCLUDED.notes_top_tr,
    notes_middle_ar = EXCLUDED.notes_middle_ar,
    notes_middle_en = EXCLUDED.notes_middle_en,
    notes_middle_tr = EXCLUDED.notes_middle_tr,
    notes_base_ar = EXCLUDED.notes_base_ar,
    notes_base_en = EXCLUDED.notes_base_en,
    notes_base_tr = EXCLUDED.notes_base_tr,
    featured = EXCLUDED.featured,
    active = EXCLUDED.active,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();
"""

inserted = 0
skipped = 0

for p in products:
    try:
        n = p['notes']
        top = n['top']['en'][:500]
        mid = n['middle']['en'][:500]
        base = n['base']['en'][:500]
        desc = p['description']['en'][:2000]

        cur.execute(INSERT_SQL, (
            p['id'],
            p['name']['ar'][:200], p['name']['en'][:200], p['name']['tr'][:200],
            desc, desc, desc,
            p['category'],
            p['price50ml'], p['price100ml'],
            p['image'],
            p['inspiredBy'][:200],
            p['originalPerfume'][:200],
            top, top, top,
            mid, mid, mid,
            base, base, base,
            p.get('featured', False),
            True,
            0,
        ))
        inserted += 1
    except Exception as e:
        print(f"  SKIP {p['id']}: {e}")
        skipped += 1

conn.commit()
cur.close()
conn.close()

print(f"\n✅ Done: {inserted} inserted/updated, {skipped} skipped")
