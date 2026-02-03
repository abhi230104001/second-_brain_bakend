const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/signup', registerUser); // Alias for register
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
