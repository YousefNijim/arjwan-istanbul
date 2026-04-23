import psycopg2, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
conn = psycopg2.connect('postgresql://postgres.zsdlifnvprnadznustgt:WLlXnzs9q0JV4ukX@aws-1-us-east-1.pooler.supabase.com:5432/postgres')
cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM perfumes WHERE description_ar != description_en AND description_ar != ''")
done = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM perfumes")
total = cur.fetchone()[0]
cur.close(); conn.close()
pct = round(done/total*100, 1)
remaining_mins = round(((total-done) * 8 * 0.15) / 60, 0)
print(f"Translated: {done} / {total} ({pct}%)")
print(f"Remaining: {total-done} products (~{int(remaining_mins)} min)")
