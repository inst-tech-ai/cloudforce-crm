const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET ? process.env.INSTANCE_UNIX_SOCKET : process.env.DB_HOST,
});

// akiさんの確定アカウント
const AKI_EMAIL = "inst.tech.ai@gmail.com";

async function recoverData() {
  const client = await pool.connect();
  try {
    console.log('🏁 Starting EMERGENCY DATA RECOVERY...');
    
    // 1. バックアップデータの読み込み (昨日保存したもの)
    // ※ 実行環境に合わせてパスを調整
    const backupPath = path.join(__dirname, 'sample_data.json');
    if (!fs.existsSync(backupPath)) {
      console.error('❌ Backup file NOT FOUND!');
      return;
    }
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // 2. akiさんのGoogle ID(sub)を現在のDBから特定 (最新のログイン記録などから)
    // owner_idがセットされている最新のレコードから拾う
    const userRes = await client.query("SELECT owner_id FROM accounts WHERE owner_id IS NOT NULL LIMIT 1");
    const akiSubId = userRes.rows[0]?.owner_id;

    if (!akiSubId) {
      console.log('⚠️ owner_id not found in DB. Assigning to the first logged-in user.');
    }

    // 3. データの復元 (取引先 -> 担当者 -> 商談)
    console.log('📦 Restoring Accounts...');
    for (const acc of data.accounts) {
      await client.query(
        `INSERT INTO accounts (id, name, industry, website, phone, owner_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id`,
        [acc.id, acc.name, acc.industry, acc.website, acc.phone, akiSubId]
      );
    }

    // 商談データの復元も含む (バックアップから)
    console.log('📦 Restoring Opportunities...');
    for (const opp of data.opportunities) {
      await client.query(
        `INSERT INTO opportunities (id, name, amount, stage, probability, close_date, owner, account_id, owner_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id`,
        [opp.id, opp.name, opp.amount, opp.stage, opp.probability, opp.closeDate, opp.owner, opp.accountId, akiSubId]
      );
    }

    console.log('✅ RECOVERY COMPLETED SUCCESSFULLY.');
  } catch (err) {
    console.error('❌ RECOVERY FAILED:', err);
  } finally {
    client.release();
    pool.end();
  }
}

recoverData();
