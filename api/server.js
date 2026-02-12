const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// CORS設定を強化 (全ドメイン許可)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET ? process.env.INSTANCE_UNIX_SOCKET : process.env.DB_HOST,
});

// ルート
app.get('/', (req, res) => {
  res.send('Cloudforce API is running! 🚀');
});

// DBチェック
app.get('/api/db-check', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as now');
    client.release();
    res.json({ status: 'success', message: 'Database connected successfully! ✅', timestamp: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 顧客一覧取得
app.get('/api/customers', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM customers ORDER BY created_at DESC');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('❌ GET /api/customers error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// 顧客追加
app.post('/api/customers', async (req, res) => {
  const { name, email, company, status } = req.body;
  console.log('📥 POST /api/customers received:', req.body); // リクエスト内容をログ出力

  if (!name || !email) {
    console.error('❌ Validation error: Name and Email are required');
    return res.status(400).json({ error: 'Name and Email are required' });
  }
  
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO customers (name, email, company, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, company, status || 'Lead']
    );
    client.release();
    console.log('✅ Customer created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ POST /api/customers DB error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
