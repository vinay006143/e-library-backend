import Book from "../models/Book.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if user already reviewed
    const existingReview = book.reviews.find(
      (r) => r.user.toString() === req.user.id
    );
    if (existingReview)
      return res.status(400).json({ message: "You already reviewed this book" });

    book.reviews.push({ user: req.user.id, rating, text });
    await book.save();

    res.status(201).json({ message: "Review added", reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};

// Edit Review
export const editReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const review = book.reviews.find(r => r._id.toString() === req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    review.rating = rating;
    review.text = text;
    await book.save();

    res.json({ message: "Review updated", reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ message: "Error editing review", error });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviewIndex = book.reviews.findIndex(r => r._id.toString() === req.params.reviewId);
    if (reviewIndex === -1) return res.status(404).json({ message: "Review not found" });

    if (book.reviews[reviewIndex].user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    book.reviews.splice(reviewIndex, 1);
    await book.save();

    res.json({ message: "Review deleted", reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

// Get Book with Reviews & Avg Rating
export const getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews.user", "username");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const avgRating =
      book.reviews.length > 0
        ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
        : 0;

    res.json({ book, avgRating });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};
