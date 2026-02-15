const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET ? process.env.INSTANCE_UNIX_SOCKET : process.env.DB_HOST,
});

// Aki's ID from logs
const AKI_SUB_ID = "101041918549309450013";

async function fixOwnership() {
  const client = await pool.connect();
  try {
    console.log('🏁 Starting OWNERSHIP FIX...');

    // 1. Accounts
    const resAcc = await client.query(
      `UPDATE accounts SET owner_id = $1`, 
      [AKI_SUB_ID]
    );
    console.log(`✅ Updated ${resAcc.rowCount} accounts to owner ${AKI_SUB_ID}`);

    // 2. Customers
    const resCust = await client.query(
      `UPDATE customers SET owner_id = $1`,
      [AKI_SUB_ID]
    );
    console.log(`✅ Updated ${resCust.rowCount} customers to owner ${AKI_SUB_ID}`);

    // 3. Opportunities
    const resOpp = await client.query(
      `UPDATE opportunities SET owner_id = $1`,
      [AKI_SUB_ID]
    );
    console.log(`✅ Updated ${resOpp.rowCount} opportunities to owner ${AKI_SUB_ID}`);

  } catch (err) {
    console.error('❌ FIX FAILED:', err);
  } finally {
    client.release();
    pool.end();
  }
}

fixOwnership();
