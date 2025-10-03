// routes/bookRoutes.js
import express from "express";
import Book from "../models/Book.js";
import { authMiddleware } from "../middlewares/bookauth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/**
 * Add Book
 * Only logged-in users
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body;
    const newBook = new Book({
      title,
      author,
      description,
      genre,
      publishedYear,
      createdBy: req.user.id
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
});

/**
 * Get Books (with pagination)
 * Public route
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("createdBy", "username email");

    const totalBooks = await Book.countDocuments();
    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

/**
 * Get Single Book with Reviews & Average Rating
 */
router.get("/:id", async (req, res) => {
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
});

/**
 * Edit Book
 * Only book creator can edit
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this book" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
});

/**
 * Delete Book
 * Only book creator can delete
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this book" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
});

/**
 * Upload Thumbnail & PDF
 * Only book creator
 */
router.post(
  "/upload/:id",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      if (book.createdBy.toString() !== req.user.id)
        return res.status(403).json({ message: "Not authorized to upload for this book" });

      if (req.files.thumbnail) book.thumbnail = `/uploads/images/${req.files.thumbnail[0].filename}`;
      if (req.files.pdf) book.pdf = `/uploads/pdfs/${req.files.pdf[0].filename}`;

      await book.save();
      res.status(200).json(book);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error uploading files", err });
    }
  }
);

/**
 * Add Review
 */
router.post("/:id/review", authMiddleware, async (req, res) => {
  try {
    const { rating, text } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if user already reviewed
    const existingReview = book.reviews.find(r => r.user.toString() === req.user.id);
    if (existingReview)
      return res.status(400).json({ message: "You already reviewed this book" });

    book.reviews.push({ user: req.user.id, rating, text });
    await book.save();
    res.status(201).json({ message: "Review added", reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
});

/**
 * Update Review
 */
router.put("/:id/review/:reviewId", authMiddleware, async (req, res) => {
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
});

/**
 * Delete Review
 */
router.delete("/:id/review/:reviewId", authMiddleware, async (req, res) => {
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
});

/**
 * Get Reviews for a Book
 * Accessible without authentication
 */
router.get("/:id/reviews", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("reviews.user", "name email"); // optional: populate user info
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});
export default router;
