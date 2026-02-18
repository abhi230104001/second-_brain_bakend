const asyncHandler = require('express-async-handler');
const Folder = require('../models/folderModel');




const getFolders = asyncHandler(async (req, res) => {
    const folders = await Folder.find({ userId: req.user.id });
    res.status(200).json(folders);
});




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




const deleteFolder = asyncHandler(async (req, res) => {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
        res.status(404);
        throw new Error('Folder not found');
    }

    
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    
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
