const { useState } = React;

const App = () => {
  const [hotels, setHotels] = useState([]);
  const [searchParams, setSearchParams] = useState({ destination: '', check_in: '', check_out: '', people: 1 });
  const [comments, setComments] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const searchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/search', { params: searchParams });
      setHotels(response.data.results || []);
    } catch (error) {
      console.error('Arama hatası:', error);
    }
  };

  const bookHotel = async (hotel_id, room_id) => {
    try {
      await axios.post('http://localhost:3000/api/v1/bookings', { hotel_id, room_id, user_id: 'user123', ...searchParams });
      alert('Rezervasyon yapıldı!');
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      alert('Rezervasyon başarısız!');
    }
  };

  const fetchComments = async (hotel_id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/comments?hotel_id=${hotel_id}`);
      setComments(response.data.comments || []);
      const ctx = document.getElementById('commentsChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: response.data.distribution.map(d => d._id),
          datasets: [{ label: 'Yorum Dağılımı', data: response.data.distribution.map(d => d.count) }]
        }
      });
    } catch (error) {
      console.error('Yorumlar hatası:', error);
    }
  };

  const handleChat = () => {
    if (chatInput.includes('otel bul')) {
      const [_, destination, people] = chatInput.match(/(.+) için (\d) kişi/) || [];
      setSearchParams({ ...searchParams, destination, people: parseInt(people) || 1 });
      searchHotels();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Otel Rezervasyon Sistemi</h1>
      <div className="my-4">
        <input type="text" placeholder="Destinasyon" onChange={e => setSearchParams({ ...searchParams, destination: e.target.value })} className="border p-2 mr-2" />
        <input type="date" onChange={e => setSearchParams({ ...searchParams, check_in: e.target.value })} className="border p-2 mr-2" />
        <input type="date" onChange={e => setSearchParams({ ...searchParams, check_out: e.target.value })} className="border p-2 mr-2" />
        <input type="number" placeholder="Kişi sayısı" onChange={e => setSearchParams({ ...searchParams, people: parseInt(e.target.value) || 1 })} className="border p-2 mr-2" />
        <button onClick={searchHotels} className="bg-blue-500 text-white p-2">Ara</button>
      </div>
      <div>
        {hotels.map(hotel => (
          <div key={hotel.id} className="border p-4 my-2">
            <h2>{hotel.name}</h2>
            <p>Fiyat: {hotel.price} TL</p>
            <button onClick={() => bookHotel(hotel.hotel_id, hotel.id)} className="bg-green-500 text-white p-2 mr-2">Rezervasyon Yap</button>
            <button onClick={() => fetchComments(hotel.hotel_id)} className="bg-gray-500 text-white p-2">Yorumları Gör</button>
            <iframe src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`} width="300" height="200" className="my-2"></iframe>
          </div>
        ))}
      </div>
      <canvas id="commentsChart" className="my-4"></canvas>
      <div>
        <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} className="border p-2 mr-2" />
        <button onClick={handleChat} className="bg-purple-500 text-white p-2">AI ile Konuş</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));