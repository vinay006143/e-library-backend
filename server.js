// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/userRoute.js";
import bookRoutes from "./routes/bookRoutes.js";
import favoritesRoutes from "./routes/favoritesBookRoutes.js";
import readBooksRoutes from "./routes/readBooks.js";
import profileRoutes from "./routes/profileRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://e-library-pro.vercel.app"], // ✅ removed trailing slash
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder statically (optional, if you use multer for profile images/books)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/read-books", readBooksRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/categories", categoryRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("✅ eLibrary API is running on Render!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
