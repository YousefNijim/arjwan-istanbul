import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS additional_images jsonb DEFAULT '[]' NOT NULL;`);
    console.log('Successfully added additional_images column');
  } catch (error) {
    console.error('Error adding column:', error);
  }
  process.exit(0);
}

main();
