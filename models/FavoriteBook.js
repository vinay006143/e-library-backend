const mongoose = require("mongoose");

const favoriteBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  title: String,
  author: String,
  coverUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("FavoriteBook", favoriteBookSchema);
