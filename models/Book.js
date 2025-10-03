// backend/models/Book.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, default: "" },
  },
  { timestamps: true }
);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, default: "" },
    genre: { type: String, default: "" },
    publishedYear: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    thumbnail: { type: String, default: "" }, // optional
    pdf: { type: String, default: "" },       // optional
    reviews: [reviewSchema],                  // nested reviews
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
