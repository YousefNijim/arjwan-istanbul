import 'dotenv/config';
import { db } from '../server/db';
import { perfumes } from '../shared/schema';

async function main() {
  console.log('Deleting all perfumes...');
  const result = await db.delete(perfumes);
  console.log(`Deleted all perfumes from the database.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
