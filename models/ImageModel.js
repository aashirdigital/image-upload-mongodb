const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
})

const ImageModel = mongoose.model('image', imageSchema);
module.exports = ImageModel;