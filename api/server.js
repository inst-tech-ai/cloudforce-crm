const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const GOOGLE_CLIENT_ID = "987189753237-ebplf2i51fq0dkp9tctmcpt983ug9rmp.apps.googleusercontent.com";
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const AKI_EMAIL = "inst.tech.ai@gmail.com";

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.INSTANCE_UNIX_SOCKET ? process.env.INSTANCE_UNIX_SOCKET : process.env.DB_HOST,
});

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const ticket = await oauthClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    
    req.user = { id: payload.sub, email: payload.email };
    req.isAki = (payload.email === AKI_EMAIL);

    // デバッグログ: ログインユーザーのIDを特定するため
    if (req.isAki) {
      console.log(`🔑 Aki logged in! Email: ${payload.email}, Sub ID: ${payload.sub}`);
    }
    
    next();
  } catch (error) { 
    console.error('Auth Error:', error.message);
    res.status(401).json({ error: 'Invalid token' }); 
  }
};

// --- Accounts ---
app.get('/api/accounts', authenticate, async (req, res) => {
  try {
    const condition = req.isAki ? `(owner_id = $1 OR owner_id IS NULL)` : `owner_id = $1`;
    const result = await pool.query(`SELECT * FROM accounts WHERE ${condition} ORDER BY created_at DESC`, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/accounts', authenticate, async (req, res) => {
  const { name, industry, website, phone } = req.body;
  try {
    const result = await pool.query('INSERT INTO accounts (name, industry, website, phone, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, industry, website, phone, req.user.id]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/accounts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, industry, website, phone } = req.body;
  try {
    const result = await pool.query('UPDATE accounts SET name = $1, industry = $2, website = $3, phone = $4 WHERE id = $5 AND (owner_id = $6 OR (owner_id IS NULL AND $7 = true)) RETURNING *', [name, industry, website, phone, id, req.user.id, req.isAki]);
    if (result.rows.length === 0) return res.status(403).json({ error: 'Access denied' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/accounts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM accounts WHERE id = $1 AND (owner_id = $2 OR (owner_id IS NULL AND $3 = true)) RETURNING id', [id, req.user.id, req.isAki]);
    if (result.rows.length === 0) return res.status(403).json({ error: 'Access denied' });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Customers (担当者) ---
app.get('/api/customers', authenticate, async (req, res) => {
  try {
    const condition = req.isAki ? `(c.owner_id = $1 OR c.owner_id IS NULL)` : `c.owner_id = $1`;
    const result = await pool.query(`SELECT c.*, a.name as account_name FROM customers c LEFT JOIN accounts a ON c.account_id = a.id WHERE ${condition} ORDER BY c.created_at DESC`, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/customers', authenticate, async (req, res) => {
  const { name, email, company, title, phone, city, source, status, account_id } = req.body;
  try {
    const result = await pool.query('INSERT INTO customers (name, email, company, title, phone, city, source, status, account_id, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [name, email, company, title, phone, city, source, status || 'Lead', account_id, req.user.id]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/customers/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, email, company, title, phone, city, source, status, account_id } = req.body;
  try {
    const result = await pool.query('UPDATE customers SET name = $1, email = $2, company = $3, title = $4, phone = $5, city = $6, source = $7, status = $8, account_id = $9 WHERE id = $10 AND (owner_id = $11 OR (owner_id IS NULL AND $12 = true)) RETURNING *', [name, email, company, title, phone, city, source, status, account_id, id, req.user.id, req.isAki]);
    if (result.rows.length === 0) return res.status(403).json({ error: 'Access denied' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/customers/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 AND (owner_id = $2 OR (owner_id IS NULL AND $3 = true)) RETURNING id', [id, req.user.id, req.isAki]);
    if (result.rows.length === 0) return res.status(403).json({ error: 'Access denied' });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Opportunities ---
app.get('/api/opportunities', authenticate, async (req, res) => {
  try {
    const condition = req.isAki ? `(o.owner_id = $1 OR o.owner_id IS NULL)` : `o.owner_id = $1`;
    const result = await pool.query(`SELECT o.*, a.name as account_name FROM opportunities o LEFT JOIN accounts a ON o.account_id = a.id WHERE ${condition} ORDER BY o.created_at DESC`, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/opportunities', authenticate, async (req, res) => {
  const { name, amount, stage, probability, close_date, owner, account_id } = req.body;
  try {
    const result = await pool.query('INSERT INTO opportunities (name, amount, stage, probability, close_date, owner, account_id, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [name, amount, stage, probability, close_date, owner, account_id, req.user.id]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Authenticated Multi-User API listening on port ${PORT}`));
