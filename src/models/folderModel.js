const mongoose = require('mongoose');

const folderSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a folder name'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Folder', folderSchema);
