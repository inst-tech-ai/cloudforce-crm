const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET ? process.env.INSTANCE_UNIX_SOCKET : process.env.DB_HOST,
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('📦 Creating customers table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        company VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Lead',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table created successfully!');
    
    // サンプルデータを入れる
    console.log('🌱 Seeding data...');
    const result = await client.query('SELECT COUNT(*) FROM customers');
    if (result.rows[0].count === '0') {
      await client.query(`
        INSERT INTO customers (name, email, company, status) VALUES
        ('田中 太郎', 'tanaka@example.com', 'Example Inc.', 'Active'),
        ('鈴木 花子', 'suzuki@test.co.jp', 'Test Corp.', 'Lead'),
        ('佐藤 一郎', 'sato@demo.net', 'Demo Ltd.', 'Closed')
      `);
      console.log('✅ Sample data inserted!');
    } else {
      console.log('ℹ️ Table already has data, skipping seed.');
    }

  } catch (err) {
    console.error('❌ Error setting up database:', err);
  } finally {
    client.release();
    pool.end();
  }
}

setupDatabase();
