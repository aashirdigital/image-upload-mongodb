const express = require('express');
const userModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const authMiddleware = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken')

// Create a router object
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(201).send({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        // Create a new user
        const newUser = new userModel(req.body);
        await newUser.save();

        res.status(200).send({ success: true, message: 'Registration successful' });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Registration Controller: ${error.message}`,
        });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await userModel.findOne({ email });
        // Check if the user exists and the password is correct
        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            if (isPasswordMatch) {
                res.status(200).send({
                    success: true,
                    message: 'Login successful',
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        token: token
                    },
                });
            } else {
                res.status(401).send({
                    success: false,
                    message: 'Invalid password',
                });
            }
        } else {
            res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Login Controller: ${error.message}`,
        });
    }
});

// AUTHENTICATION
router.post('/getUserData', authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        // user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: "user not found",
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: {
                    name: user.name,
                    email: user.email
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Auth Error",
            success: false,
            error
        })
    }
})

module.exports = router;
