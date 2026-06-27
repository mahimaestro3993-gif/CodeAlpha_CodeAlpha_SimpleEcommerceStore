const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper function to generate an encrypted JWT token
const generateToken = (id) => {
    const secretKey = process.env.JWT_SECRET || 'super_secret_key_change_this_later';
    return jwt.sign({ id }, secretKey, {
        expiresIn: '30d', // Token remains valid for 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Check if a user with that email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create the new user (password is automatically hashed by our User model pre-save hook)
        const user = await User.create({
            username,
            email,
            password
        });

        // 3. Respond with user details and their brand new access token
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email and explicitly bring back the hidden password field
        const user = await User.findOne({ email }).select('+password');

        // Verify if the user exists and the password match calculations clear out true
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;