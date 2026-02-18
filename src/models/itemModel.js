const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: {
            type: String,
            required: true,
            enum: ['LINK', 'VIDEO', 'DOCUMENT', 'IMAGE', 'NOTE'],
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        description: {
            type: String,
        },
        content: {
            type: String, 
        },
        url: {
            type: String, 
        },
        fileUrl: {
            type: String, 
        },
        thumbnail: {
            type: String,
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag',
            },
        ],
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder',
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Item', itemSchema);
