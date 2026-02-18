const asyncHandler = require('express-async-handler');
const Tag = require('../models/tagModel');




const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find({ userId: req.user.id });
    res.status(200).json(tags);
});




const createTag = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400);
        throw new Error('Please add a text field');
    }

    const tag = await Tag.create({
        name: req.body.name,
        userId: req.user.id,
    });

    res.status(200).json(tag);
});




const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
        res.status(404);
        throw new Error('Tag not found');
    }

    
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    
    if (tag.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await tag.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getTags,
    createTag,
    deleteTag,
};
