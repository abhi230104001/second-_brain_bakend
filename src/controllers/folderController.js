const asyncHandler = require('express-async-handler');
const Folder = require('../models/folderModel');

// @desc    Get all folders
// @route   GET /api/folders
// @access  Private
const getFolders = asyncHandler(async (req, res) => {
    const folders = await Folder.find({ userId: req.user.id });
    res.status(200).json(folders);
});

// @desc    Create a folder
// @route   POST /api/folders
// @access  Private
const createFolder = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400);
        throw new Error('Please add a text field');
    }

    const folder = await Folder.create({
        name: req.body.name,
        userId: req.user.id,
    });

    res.status(200).json(folder);
});

// @desc    Delete a folder
// @route   DELETE /api/folders/:id
// @access  Private
const deleteFolder = asyncHandler(async (req, res) => {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
        res.status(404);
        throw new Error('Folder not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the folder user
    if (folder.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await folder.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getFolders,
    createFolder,
    deleteFolder,
};
