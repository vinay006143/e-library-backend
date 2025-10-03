const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  markFavorite,
  unmarkFavorite,
  getFavorites
} = require("../controllers/favoriteBookController"); // ✅ Destructure correctly

router.post("/mark", auth, markFavorite);
router.delete("/unmark/:bookId", auth, unmarkFavorite);
router.get("/my", auth, getFavorites);

module.exports = router;
