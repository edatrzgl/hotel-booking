const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Servis URL’leri
const services = {
  admin: 'http://admin-service:3001/api/v1',
  search: 'http://search-service:3002/api/v1',
  booking: 'http://booking-service:3003/api/v1',
  comments: 'http://comments-service:3004/api/v1'
};

// Admin servis yönlendirme (kimlik doğrulama gerekli)
app.use('/api/v1/admin', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${services.admin}${req.path.replace('/api/v1/admin', '')}`,
      headers: { Authorization: req.headers.authorization },
      data: req.body
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Diğer servisler için yönlendirme
['search', 'booking', 'comments'].forEach(service => {
  app.use(`/api/v1/${service}`, async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${services[service]}${req.path.replace(`/api/v1/${service}`, '')}`,
        data: req.body,
        headers: req.headers
      });
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });
});

app.listen(3000, () => console.log('API Gateway running on port 3000'));