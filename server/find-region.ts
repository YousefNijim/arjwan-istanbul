import 'dotenv/config';
import { Pool } from 'pg';

const PROJECT = 'zsdlifnvprnadznustgt';
const PASSWORD = 'WLlXnzs9q0JV4ukX';

const regions = [
  'eu-central-1', 'us-east-1', 'eu-west-2', 'us-west-1',
  'ap-southeast-1', 'eu-west-1', 'ap-northeast-1', 'ap-south-1',
  'ap-southeast-2', 'sa-east-1', 'ca-central-1', 'us-east-2'
];

async function testRegion(region: string) {
  const poolerHost = `aws-0-${region}.pooler.supabase.com`;
  const connStr = `postgresql://postgres.${PROJECT}:${PASSWORD}@${poolerHost}:5432/postgres`;
  const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 6000 });
  try {
    const client = await pool.connect();
    console.log(`✅ CONNECTED: ${region} → ${poolerHost}`);
    client.release();
    await pool.end();
    return region;
  } catch (e: any) {
    const msg = e.message.split('\n')[0];
    console.log(`❌ ${region}: ${msg}`);
    await pool.end();
    return null;
  }
}

(async () => {
  for (const r of regions) {
    const found = await testRegion(r);
    if (found) {
      console.log(`\n🎯 Use this in .env:`);
      console.log(`DATABASE_URL=postgresql://postgres.${PROJECT}:${PASSWORD}@aws-0-${found}.pooler.supabase.com:5432/postgres`);
      process.exit(0);
    }
  }
  console.log('\n❌ No region worked.');
  process.exit(1);
})();
