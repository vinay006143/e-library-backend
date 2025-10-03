const mongoose = require('mongoose');

const bookReadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: String,
  title: String,
  author: String,
  coverImage: String,
  readAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BookRead', bookReadSchema);
