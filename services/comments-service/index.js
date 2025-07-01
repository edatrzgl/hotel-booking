const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/hotel_db');

const CommentSchema = new mongoose.Schema({
  hotel_id: Number,
  user_id: String,
  rating: Number,
  comment: String,
  service_type: String,
  created_at: Date
});

const Comment = mongoose.model('Comment', CommentSchema);

app.get('/api/v1/comments', async (req, res) => {
  const { hotel_id, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const comments = await Comment.find({ hotel_id }).skip(skip).limit(Number(limit));
    const distribution = await Comment.aggregate([
      { $match: { hotel_id: Number(hotel_id) } },
      { $group: { _id: '$service_type', count: { $sum: 1 } } }
    ]);
    res.json({ comments, distribution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3004, () => console.log('Comments Service running on port 3004'));