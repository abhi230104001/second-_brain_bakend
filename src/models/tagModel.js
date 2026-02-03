const mongoose = require('mongoose');

const tagSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a tag name'],
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

module.exports = mongoose.model('Tag', tagSchema);
