// models/profileModel.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String, // Image URL (Cloudinary or local path)
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
