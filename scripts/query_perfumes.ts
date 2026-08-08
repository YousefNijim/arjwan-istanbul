import 'dotenv/config';
import { db } from '../server/db';
import { perfumes } from '../shared/schema';

async function main() {
  const allPerfumes = await db.select().from(perfumes);
  console.log(JSON.stringify(allPerfumes, null, 2));
  process.exit(0);
}

main();
