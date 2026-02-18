const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const cloudinary = require('../utils/cloudinary');




const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find({ userId: req.user.id })
        .populate('tags')
        .populate('folderId')
        .sort({ createdAt: -1 });
    res.status(200).json(items);
});




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




const createItem = asyncHandler(async (req, res) => {
    const { type, title, description, content, url, tags, folderId, isFavorite } = req.body;
    let fileUrl = '';
    let thumbnail = '';

    
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
                folder: "second-brain",
            });
            fileUrl = result.secure_url;
            
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
        tags: tags ? JSON.parse(tags) : [], 
        folderId: folderId || null, 
        isFavorite: isFavorite === 'true', 
    });

    res.status(201).json(item);
});




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
