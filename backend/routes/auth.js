// Authentication Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'cropxai_secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email or username' 
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            name
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error registering user',
            error: error.message 
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide username and password' 
            });
        }

        // Check for user
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error logging in',
            error: error.message 
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { username, email, newPassword } = req.body;

        // Find user
        const user = await User.findOne({ username, email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found with provided credentials' 
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error resetting password',
            error: error.message 
        });
    }
});

module.exports = router;
