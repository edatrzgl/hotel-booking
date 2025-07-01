const express = require('express');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const app = express();

app.use(express.json());

const dbConfig = {
  user: 'sa',
  password: 'Msixyz7777@;',
  server: 'mssql',
  database: 'hotel_db',
  options: { encrypt: true, trustServerCertificate: true },
  port: 1433
};

// JWT middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token gerekli' });
  try {
    jwt.verify(token, 'secret_key'); // Gerçek projede güvenli bir anahtar kullan
    next();
  } catch (error) {
    res.status(403).json({ error: 'Geçersiz token' });
  }
};

// Oda ekleme
app.post('/api/v1/admin/rooms', authenticate, async (req, res) => {
  const { hotel_id, room_type, capacity, price, start_date, end_date } = req.body;
  try {
    let pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('hotel_id', sql.Int, hotel_id)
      .input('room_type', sql.VarChar(50), room_type)
      .input('capacity', sql.Int, capacity)
      .input('price', sql.Float, price)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .input('is_available', sql.Bit, 1)
      .query('INSERT INTO rooms (hotel_id, room_type, capacity, price, start_date, end_date, is_available) OUTPUT INSERTED.* VALUES (@hotel_id, @room_type, @capacity, @price, @start_date, @end_date, @is_available)');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Oda güncelleme
app.put('/api/v1/admin/rooms/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { is_available, start_date, end_date } = req.body;
  try {
    let pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('is_available', sql.Bit, is_available)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .query('UPDATE rooms SET is_available = @is_available, start_date = @start_date, end_date = @end_date WHERE id = @id; SELECT * FROM rooms WHERE id = @id');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Admin Service running on port 3001'));