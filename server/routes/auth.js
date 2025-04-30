// Fixed auth.js route
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json("User already exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        const { password: pw, ...userData } = savedUser._doc;
        res.status(201).json(userData);
    } catch (err) {
        res.status(500).json("Something went wrong during registration.");
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json("User not found!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json("Wrong credentials!");

        const token = jwt.sign(
            { _id: user._id, username: user.username, email: user.email },
            process.env.SECRET,
            { expiresIn: "3d" }
        );

        const { password: pw, ...userData } = user._doc;

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Always set to true for production
            sameSite: "none", // Important for cross-domain cookies
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        }).status(200).json(userData);
    } catch (err) {
        res.status(500).json("Login failed.");
    }
});

// LOGOUT
router.get("/logout", (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true, // Always set to true for production
            sameSite: "none" // Important for cross-domain cookies
        }).status(200).send("User logged out successfully!");
    } catch (err) {
        res.status(500).json("Logout failed.");
    }
});

// REFETCH USER
router.get("/refetch", (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json("No token found.");

    jwt.verify(token, process.env.SECRET, {}, async (err, decoded) => {
        if (err) return res.status(403).json("Token is invalid or expired.");
        
        // Add more user data if needed
        try {
            const user = await User.findById(decoded._id).select("-password");
            if (!user) return res.status(404).json("User not found");
            
            res.status(200).json(decoded);
        } catch (err) {
            res.status(500).json("Error fetching user");
        }
    });
});

module.exports = router;