const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password,gender } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username & password required' });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'username taken' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash: hash,gender });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, username: user.username, coins: user.coins } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      $or: [{ username:email }, { email }]
    });
    if (!user) return res.status(400).json({ message: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ message: 'invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, username: user.username, coins: user.coins, hasCompletedOnboarding: user.hasCompletedOnboarding } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
