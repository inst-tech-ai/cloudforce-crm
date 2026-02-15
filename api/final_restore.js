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

// ログから特定した akiさんのGoogle ID
const AKI_SUB_ID = "101041918549309450013";

async function forceRestore() {
  const client = await pool.connect();
  try {
    console.log('🏁 Starting FINAL DATA RESTORE for aki...');
    
    const backupPath = path.join(__dirname, 'sample_data.json');
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // 1. 取引先(Accounts)の復旧
    console.log('📦 Restoring Accounts...');
    for (const acc of data.accounts) {
      await client.query(
        `INSERT INTO accounts (id, name, industry, website, phone, owner_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (id) DO UPDATE SET 
           name = EXCLUDED.name, 
           industry = EXCLUDED.industry, 
           website = EXCLUDED.website, 
           phone = EXCLUDED.phone,
           owner_id = EXCLUDED.owner_id`,
        [acc.id, acc.name, acc.industry, acc.website, acc.phone, AKI_SUB_ID]
      );
    }

    // 2. 担当者(Customers)の既存データの owner_id を一括更新
    console.log('📦 Updating existing Customers to aki...');
    await client.query(
      `UPDATE customers SET owner_id = $1 WHERE owner_id IS NULL OR email LIKE '%example.com' OR email LIKE '%test.co.jp' OR email LIKE '%demo.net'`,
      [AKI_SUB_ID]
    );

    // 3. 商談(Opportunities)の復旧
    console.log('📦 Restoring Opportunities...');
    for (const opp of data.opportunities) {
      await client.query(
        `INSERT INTO opportunities (id, name, amount, stage, probability, close_date, owner, account_id, owner_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id`,
        [opp.id, opp.name, opp.amount, opp.stage, opp.probability, opp.closeDate, opp.owner, opp.accountId, AKI_SUB_ID]
      );
    }

    console.log('✅ ALL DATA RESTORED AND LOCKED TO AKI.');
  } catch (err) {
    console.error('❌ RESTORE FAILED:', err);
  } finally {
    client.release();
    pool.end();
  }
}

forceRestore();
