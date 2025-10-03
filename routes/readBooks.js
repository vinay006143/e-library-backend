const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
    markRead,
    unmarkRead,
    getReadBooks,

} = require("../controllers/readBookController");

router.post("/mark", auth, markRead);
router.delete("/unmark/:bookId", auth, unmarkRead);
router.get("/my", auth, getReadBooks);

module.exports = router;
