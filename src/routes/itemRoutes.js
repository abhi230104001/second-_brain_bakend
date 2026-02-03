const express = require('express');
const router = express.Router();
const {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
    .get(protect, getItems)
    .post(protect, upload.single('file'), createItem);

router.route('/:id')
    .get(protect, getItem)
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
