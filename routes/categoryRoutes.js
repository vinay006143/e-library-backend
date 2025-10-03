const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { verifyAdmin } = require("../middlewares/authMiddleware");

// Public fetch, protected create/delete (optional)
router.get("/", getCategories);
router.post("/", verifyAdmin, createCategory);
router.delete("/:id", verifyAdmin, deleteCategory);

module.exports = router;
