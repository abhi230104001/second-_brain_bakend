const express = require('express');
const router = express.Router();
const {
    getTags,
    createTag,
    deleteTag,
} = require('../controllers/tagController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getTags).post(protect, createTag);
router.route('/:id').delete(protect, deleteTag);

module.exports = router;
