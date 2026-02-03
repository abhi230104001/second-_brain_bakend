const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all items
// @route   GET /api/items
// @access  Private
const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find({ userId: req.user.id })
        .populate('tags')
        .populate('folderId')
        .sort({ createdAt: -1 });
    res.status(200).json(items);
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
const getItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    if (item.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.status(200).json(item);
});

// @desc    Create an item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
    const { type, title, description, content, url, tags, folderId, isFavorite } = req.body;
    let fileUrl = '';
    let thumbnail = '';

    // Handle File Upload
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
                folder: "second-brain",
            });
            fileUrl = result.secure_url;
            // Basic thumbnail logic could be improved
            if (result.resource_type === 'image') thumbnail = result.secure_url;
        } catch (err) {
            console.error(err);
            res.status(500);
            throw new Error('Image upload failed');
        }
    }

    const item = await Item.create({
        userId: req.user.id,
        type,
        title,
        description,
        content,
        url,
        fileUrl,
        thumbnail,
        tags: tags ? JSON.parse(tags) : [], // Expecting tags as stringified array if getting from formdata
        folderId: folderId || null, // Handle empty string case
        isFavorite: isFavorite === 'true', // FormData sends strings
    });

    res.status(201).json(item);
});

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    if (item.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedItem);
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    if (item.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await item.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
};
