const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET ? process.env.INSTANCE_UNIX_SOCKET : process.env.DB_HOST,
});

// akiさんのGoogleアカウントの一意なID (inst.tech.ai@gmail.com)
// 昨日のログから推測、あるいはAPI側で自動紐付けするための準備
const AKI_EMAIL = "inst.tech.ai@gmail.com";

async function migrateToMultiUser() {
  const client = await pool.connect();
  try {
    console.log('🚀 Migrating to Multi-User environment...');

    // 1. 各テーブルに owner_id (Google sub ID) カラムを追加
    await client.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS owner_id VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS owner_id VARCHAR(255);`);
    await client.query(`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS owner_id VARCHAR(255);`);
    console.log('✅ owner_id columns added.');

    // 2. 既存のデータを "inst.tech.ai@gmail.com" 専用としてマークするための準備
    // ※ 実際のGoogle ID(sub)はログイン時に取得するため、一旦メールアドレス等で紐付け、
    // API側で「owner_idがNULLなら akiさんのもの」として扱うか、
    // あるいは最初のログイン時に一括更新するロジックを入れます。
    
    console.log('✅ Migration prepared. Existing data will be assigned to aki on first login.');

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrateToMultiUser();
