const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual JWT secret

// Commented out: Nodemailer transporter setup
/*
const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'stubuddies0@gmail.com', // Your email address
        pass: 'kctv dmkc vpcl cpvp', // Your actual Gmail App Password (not login password)
    },
});
*/

// Sign Up Route without OTP
router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password, gender, termsAccepted } = req.body;  

    // Ensure gender is provided and terms are accepted
    if (!gender) {
        return res.status(400).json({ message: 'Gender is required' });
    }

    if (!termsAccepted) {
        return res.status(400).json({ message: 'Please accept the terms and conditions to sign up.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        // Create a new user without OTP
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, gender });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully.' });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Commented out: Generate OTP Route
/*
router.post('/generate-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Find user by email and update the OTP and expiration time
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.otp = otp;
        user.expiresAt = expiresAt;
        await user.save();

        // Send OTP email
        const mailOptions = {
            from: '"StuBuddies" <suraj.patra4167@gmail.com>',
            to: email,
            subject: 'Your StuBuddies OTP for Verification',
            text: `Your OTP for verification is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            }
            res.status(200).json({ message: 'OTP sent successfully to your email.' });
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Error generating OTP', error });
    }
});
*/

// Sign In Route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error });
    }
});

// Commented out: Verify OTP Route
/*
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP matches and is still valid
        if (user.otp === otp && user.expiresAt > new Date()) {
            // Clear OTP and expiresAt after successful verification
            user.otp = undefined;
            user.expiresAt = undefined;
            await user.save();

            res.json({ message: 'OTP verified successfully!' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
});
*/

module.exports = router;