// routes/profileRoutes.js
import express from "express";
import { upload } from "../middlewares/upload.js";
import { uploadProfileImage } from "../controllers/profileController.js"; // only upload function
import { authMiddleware } from "../middlewares/bookauth.js";

const router = express.Router();

// Upload single profile image
router.post(
  "/upload",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;
