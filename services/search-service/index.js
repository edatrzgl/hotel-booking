const express = require('express');
const sql = require('mssql');
const redis = require('redis');
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

const redisClient = redis.createClient({ url: 'redis://redis:6379' });
redisClient.connect();

app.get('/api/v1/search', async (req, res) => {
  const { destination, check_in, check_out, people, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const isAuthenticated = req.headers.authorization;

  try {
    // Redis’ten otel detaylarını al
    let hotels = await redisClient.get(`hotels:${destination}`);
    if (!hotels) {
      let pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('destination', sql.VarChar(255), destination)
        .query('SELECT * FROM hotels WHERE destination = @destination');
      hotels = result.recordset;
      await redisClient.setEx(`hotels:${destination}`, 3600, JSON.stringify(hotels));
    } else {
      hotels = JSON.parse(hotels);
    }

    // Uygun odaları bul
    let pool = await sql.connect(dbConfig);
    const rooms = await pool.request()
      .input('check_in', sql.Date, check_in)
      .input('check_out', sql.Date, check_out)
      .input('people', sql.Int, people)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset)
      .query('SELECT r.*, h.name FROM rooms r JOIN hotels h ON r.hotel_id = h.id WHERE r.is_available = 1 AND r.start_date <= @check_in AND r.end_date >= @check_out AND r.capacity >= @people ORDER BY r.id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY');

    // İndirimli fiyatlar
    const results = rooms.recordset.map(room => ({
      ...room,
      price: isAuthenticated ? room.price * 0.85 : room.price // %15 indirim
    }));

    res.json({ results, total: rooms.recordset.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3002, () => console.log('Search Service running on port 3002'));