const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET || process.env.DB_HOST,
});

async function debugDatabase() {
  const client = await pool.connect();
  try {
    console.log('--- DB DEBUG START ---');
    
    // テーブル一覧の取得
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('TABLES FOUND:', tables.rows.map(r => r.table_name).join(', '));

    // 担当者データの確認
    const customers = await client.query('SELECT COUNT(*) FROM customers');
    console.log('CUSTOMER COUNT:', customers.rows[0].count);

    // 取引先データの確認
    const accounts = await client.query('SELECT COUNT(*) FROM accounts');
    console.log('ACCOUNT COUNT:', accounts.rows[0].count);

    // 商談データの確認
    const opportunities = await client.query('SELECT COUNT(*) FROM opportunities');
    console.log('OPPORTUNITY COUNT:', opportunities.rows[0].count);

    console.log('--- DB DEBUG END ---');
  } catch (err) {
    console.error('❌ DEBUG ERROR:', err);
  } finally {
    client.release();
    pool.end();
  }
}

debugDatabase();
