import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`
      ALTER TABLE perfumes 
      ADD COLUMN IF NOT EXISTS usage_ar text NOT NULL DEFAULT 'يُرش العطر على أماكن النبض: العنق، والصدر، والمعصمين. تجنب فركه بعد الرش للحفاظ على ثبات المكونات العطرية.',
      ADD COLUMN IF NOT EXISTS usage_en text NOT NULL DEFAULT 'Apply to clean skin or clothing as often as desired. To increase longevity, it is recommended to spray on pulse points (inner wrists, neck).',
      ADD COLUMN IF NOT EXISTS usage_tr text NOT NULL DEFAULT 'Temiz tene veya kıyafete istenilen sıklıkta uygulanır. Kalıcılığı artırmak için nabız noktalarına (bilek içleri, boyun) sıkılması önerilir.'
    `);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed', err);
  }
  process.exit(0);
}

main();
