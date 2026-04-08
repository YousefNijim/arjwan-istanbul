import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { adminUsers } from '../shared/schema';

async function addAdmin() {
  const username = 'yousef';
  const password = 'Palestine26@';
  const hash = await bcrypt.hash(password, 10);

  await db.insert(adminUsers).values({ username, passwordHash: hash })
    .onConflictDoNothing();

  console.log(`✅ Admin account created: ${username}`);
  process.exit(0);
}

addAdmin().catch(e => { console.error(e); process.exit(1); });
