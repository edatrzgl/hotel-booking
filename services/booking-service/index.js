const express = require('express');
const sql = require('mssql');
const amqp = require('amqplib');
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

app.post('/api/v1/bookings', async (req, res) => {
  const { hotel_id, room_id, user_id, check_in, check_out, people } = req.body;
  try {
    let pool = await sql.connect(dbConfig);
    const room = await pool.request()
      .input('room_id', sql.Int, room_id)
      .query('SELECT capacity FROM rooms WHERE id = @room_id AND is_available = 1');
    if (!room.recordset[0] || room.recordset[0].capacity < people) {
      return res.status(400).json({ error: 'Oda müsait değil veya kapasite yetersiz' });
    }

    await pool.request()
      .input('people', sql.Int, people)
      .input('room_id', sql.Int, room_id)
      .query('UPDATE rooms SET capacity = capacity - @people WHERE id = @room_id');

    const booking = await pool.request()
      .input('hotel_id', sql.Int, hotel_id)
      .input('room_id', sql.Int, room_id)
      .input('user_id', sql.VarChar(50), user_id)
      .input('check_in', sql.Date, check_in)
      .input('check_out', sql.Date, check_out)
      .input('people', sql.Int, people)
      .query('INSERT INTO bookings (hotel_id, room_id, user_id, check_in, check_out, people) OUTPUT INSERTED.* VALUES (@hotel_id, @room_id, @user_id, @check_in, @check_out, @people)');

    // RabbitMQ’ya rezervasyon bilgisi gönder
    const conn = await amqp.connect('amqp://rabbitmq');
    const channel = await conn.createChannel();
    await channel.assertQueue('reservations');
    channel.sendToQueue('reservations', Buffer.from(JSON.stringify(booking.recordset[0])));
    await channel.close();
    await conn.close();

    res.json(booking.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3003, () => console.log('Booking Service running on port 3003'));