const express = require('express');
const auth = require('../middleware/auth');
const Character = require('../models/Character');
const User = require('../models/User');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const chars = await Character.find({});
    const data = chars?.map(c => ({
      id: c._id,
      name: c.name,
      avatar: c.avatar,
      age: c.age,
      gender: c.gender,
      orientation: c.orientation,
      personality: c.personality,
      bio: c.bio,
      sampleLine: c.sampleLine,
      isAdult: c.isAdult,
      isLocked: c.isLocked,
      price: c.price,
      rating: c.rating
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});




// ===== Unlock character (deduct coins) =====
router.post('/unlock/:id', auth, async (req, res) => {
  try {
    const char = await Character.findById(req.params.id);
    if (!char) return res.status(404).json({ message: 'Character not found' });
    if (char.defaultUnlocked) return res.status(400).json({ message: 'Character is already free' });

    const user = req.user;

    // Check if already unlocked and not expired
    const existing = user.unlockedProfiles.find(
      (p) => p.profileId === req.params.id && p.expiresAt > new Date()
    );
    if (existing) {
      return res.status(400).json({ message: 'Character already unlocked and active' });
    }

    if (user.coins < char.price) return res.status(400).json({ message: 'Not enough coins' });

    // Deduct coins
    user.coins -= char.price;

    // Add unlocked profile with 5-minute expiry
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.unlockedProfiles.push({
      profileId: req.params.id,
      expiresAt,
    });

    await user.save();

    res.json({
      message: 'Character unlocked successfully',
      coins: user.coins,
      expiresAt,
      unlockedProfiles: user.unlockedProfiles,
    });
  } catch (err) {
    console.error('Unlock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
