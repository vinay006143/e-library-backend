const FavoriteBook = require("../models/FavoriteBook");

exports.markFavorite = async (req, res) => {
  const { bookId, title, author, cover } = req.body;
  const userId = req.user.id;

  try {
    const book = new FavoriteBook({ userId, bookId, title, author, cover });
    await book.save();
    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ error: "Could not mark favorite" });
  }
};

exports.unmarkFavorite = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  try {
    await FavoriteBook.findOneAndDelete({ userId, bookId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not unmark favorite" });
  }
};

exports.getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const books = await FavoriteBook.find({ userId });
    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch favorites" });
  }
};
