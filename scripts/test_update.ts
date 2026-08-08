import { db } from '../server/db';
import { perfumes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.update(perfumes).set({
      additionalImages: ['https://example.com/test.jpg']
    }).where(eq(perfumes.id, 'yaqut')).returning();
    console.log('Success:', res);
  } catch (err) {
    console.error('Error:', err);
  }
}
main();
