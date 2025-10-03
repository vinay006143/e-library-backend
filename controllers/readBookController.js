const ReadBook = require("../models/BookRead");

exports.markRead = async (req, res) => {
  const { bookId, title, author, coverImage } = req.body;
  const userId = req.user.id;

  try {
    const book = new ReadBook({ userId, bookId, title, author, coverImage });
    await book.save();
    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ error: "Could not mark as read" });
  }
};

exports.unmarkRead = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  try {
    await ReadBook.findOneAndDelete({ userId, bookId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not unmark as read" });
  }
};

exports.getReadBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const books = await ReadBook.find({ userId });
    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch read books" });
  }
};
