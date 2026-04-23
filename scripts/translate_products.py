"""
Translates all product descriptions and notes from English → Arabic & Turkish.
Translates in batches with rate-limit protection.
Perfume names stay as-is (they are brand proper nouns).
"""
import psycopg2, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from deep_translator import GoogleTranslator

DATABASE_URL = "postgresql://postgres.zsdlifnvprnadznustgt:WLlXnzs9q0JV4ukX@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

tr_ar = GoogleTranslator(source='en', target='ar')
tr_tr = GoogleTranslator(source='en', target='tr')

def translate(text, translator, retries=3):
    if not text or not text.strip():
        return text
    for attempt in range(retries):
        try:
            result = translator.translate(text[:4500])
            time.sleep(0.15)  # gentle rate limiting
            return result or text
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"  ⚠ Translation failed: {e}")
                return text  # fallback to English
    return text

# Connect and fetch only products where ar == en (not yet translated)
conn = psycopg2.connect(DATABASE_URL)
cur  = conn.cursor()

cur.execute("""
    SELECT id, description_en, notes_top_en, notes_middle_en, notes_base_en
    FROM perfumes
    WHERE description_ar = description_en
       OR description_ar IS NULL
       OR description_ar = ''
    ORDER BY id
""")
rows = cur.fetchall()
print(f"Found {len(rows)} products needing translation")

UPDATE_SQL = """
    UPDATE perfumes SET
        description_ar=%s, description_tr=%s,
        notes_top_ar=%s, notes_top_tr=%s,
        notes_middle_ar=%s, notes_middle_tr=%s,
        notes_base_ar=%s, notes_base_tr=%s,
        updated_at=NOW()
    WHERE id=%s
"""

done = 0
errors = 0

for i, (pid, desc_en, top_en, mid_en, base_en) in enumerate(rows):
    try:
        # Translate description
        desc_ar = translate(desc_en, tr_ar)
        desc_tr = translate(desc_en, tr_tr)

        # Translate notes
        top_ar  = translate(top_en, tr_ar)
        top_tr  = translate(top_en, tr_tr)
        mid_ar  = translate(mid_en, tr_ar)
        mid_tr  = translate(mid_en, tr_tr)
        base_ar = translate(base_en, tr_ar)
        base_tr = translate(base_en, tr_tr)

        cur.execute(UPDATE_SQL, (
            desc_ar, desc_tr,
            top_ar, top_tr,
            mid_ar, mid_tr,
            base_ar, base_tr,
            pid
        ))
        done += 1

        # Commit every 20 rows to save progress
        if done % 20 == 0:
            conn.commit()
            print(f"  ✅ {done}/{len(rows)} translated...", flush=True)

    except Exception as e:
        errors += 1
        print(f"  ❌ Error on {pid}: {e}")
        conn.rollback()

conn.commit()
cur.close()
conn.close()
print(f"\n✅ Done: {done} translated, {errors} errors")
