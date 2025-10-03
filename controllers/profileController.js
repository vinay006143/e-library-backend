// controllers/profileController.js
import User from "../models/profileModel.js"; // your User model

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileImagePath = `/uploads/images/${req.file.filename}`;

    // Update user profile in DB
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImagePath },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: profileImagePath,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", err });
  }
};
