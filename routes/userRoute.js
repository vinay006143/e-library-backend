const express = require('express');
const router = express.Router(); // ✅ CORRECT way
const userController = require("../controllers/userController");

const { register,login,getAllUsers,changePassword } = require('../controllers/userController');
const auth = require("../middlewares/requireAuth");

router.post('/register', register);
router.post('/login', login); 
router.get("/", getAllUsers);
// DELETE user
router.delete("/:id", userController.deleteUser);
// Change password (auth required)
router.put('/change-password',auth, changePassword);
module.exports = router;
