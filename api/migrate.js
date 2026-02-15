const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET ? process.env.INSTANCE_UNIX_SOCKET : process.env.DB_HOST,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🏁 Ensuring database schema is correct...');
    
    // owner_id カラムをすべてのテーブルに追加 (存在しない場合のみ)
    await client.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS owner_id VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS owner_id VARCHAR(255);`);
    await client.query(`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS owner_id VARCHAR(255);`);
    
    console.log('✅ owner_id columns ensured.');
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
