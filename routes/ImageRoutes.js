const express = require('express')
const imageModel = require('../models/ImageModel')

// ROUTER OBJECT
const router = express.Router();

// ROUTES
// UPLOAD IMAGE
router.post('/uploadImage', async (req, res) => {
    try {
        const image = new imageModel({ userId: req.body.userId, name: req.body.name, image: req.body.image })
        await image.save();
        if (!image) {
            res.status(200).send({ success: false, message: "Uploading Failed.." })
        }
        res.status(200).send({ success: true, message: "Image Uploaded Successfully" })
    } catch (error) {
        res.status(500).send({ success: false, message: "Error Occured" })
    }
})

// GET ALL IMAGE OF A USER
router.post('/getAllUserImages', async (req, res) => {
    try {
        const images = await imageModel.find({ userId: req.body.userId });
        if (!images) {
            return res.status(200).send({ success: false, message: "Images not available" });
        }
        res.status(200).send({ success: true, message: "All Images fetched successful", data: images });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error Occurred" });
    }
})

// DELETE SINGLE IMAGE
router.post('/deleteImage', async (req, res) => {
    try {
        const image = await imageModel.findByIdAndDelete({ _id: req.body.id });
        if (!image) {
            return res.status(200).send({ success: false, message: "Failed to delete" });
        }
        res.status(200).send({ success: true, message: "Image deleted successfully", data: image });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error Occurred" });
    }
})

module.exports = router;