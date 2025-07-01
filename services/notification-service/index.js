const sql = require('mssql');
const amqp = require('amqplib');
const cron = require('node-cron');

const dbConfig = {
  user: 'sa',
  password: 'Msixyz7777@;',
  server: 'mssql',
  database: 'hotel_db',
  options: { encrypt: true, trustServerCertificate: true },
  port: 1433
};

// Gece 00:00’da çalışan görev
cron.schedule('0 0 * * *', async () => {
  try {
    // Kapasite %20’nin altında olan odaları kontrol et
    let pool = await sql.connect(dbConfig);
    const rooms = await pool.request()
      .input('threshold', sql.Float, 0.2 * 100)
      .query("SELECT * FROM rooms WHERE capacity < @threshold AND end_date >= GETDATE() AND end_date <= DATEADD(MONTH, 1, GETDATE())");
    if (rooms.recordset.length > 0) {
      const conn = await amqp.connect('amqp://rabbitmq');
      const channel = await conn.createChannel();
      await channel.assertQueue('notifications');
      channel.sendToQueue('notifications', Buffer.from(JSON.stringify({ type: 'low_capacity', rooms: rooms.recordset })));
      await channel.close();
      await conn.close();
    }

    // Rezervasyon kuyruğunu oku
    const conn = await amqp.connect('amqp://rabbitmq');
    const channel = await conn.createChannel();
    await channel.assertQueue('reservations');
    channel.consume('reservations', (msg) => {
      if (msg) {
        const reservation = JSON.parse(msg.content.toString());
        console.log('Rezervasyon bildirimi:', reservation); // Gerçekte e-posta gönderilir
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Hata:', error);
  }
});

console.log('Notification Service running');