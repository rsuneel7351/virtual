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
    if (req.user.coins < char.price) return res.status(400).json({ message: 'Not enough coins' });

    req.user.coins -= char.price;
    // TODO: In production, track per-user unlocked characters
    await req.user.save();

    res.json({ message: 'Character unlocked', coins: req.user.coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
