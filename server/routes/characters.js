const express = require('express');
const auth = require('../middleware/auth');
const Character = require('../models/Character');
const User = require('../models/User');

const router = express.Router();

// seed route (for dev) - create sample characters if none exist
router.post('/seed', async (req, res) => {
  try {
    const count = await Character.countDocuments();
    if (count > 0) return res.json({ msg: 'already seeded' });

    const chars = [
      { name: 'Topi', gender: 'female', personality: 'Sweet & Naughty', tags: ['Romantic','Flirty'], price: 0, defaultUnlocked: true, avatarUrl: '' },
      { name: 'Sofia', gender: 'female', personality: 'Caring GF', tags: ['Romantic'], price: 50, defaultUnlocked: false, avatarUrl: '' },
      { name: 'Arjun', gender: 'male', personality: 'Protective BF', tags: ['Bold'], price: 50, defaultUnlocked: false, avatarUrl: '' },
      { name: 'Alex', gender: 'nonbinary', personality: 'Playful', tags: ['Funny','Bisexual'], price: 80, defaultUnlocked: false, avatarUrl: '' }
    ];
    await Character.insertMany(chars);
    res.json({ msg: 'seeded' });
  } catch (err) { console.error(err); res.status(500).json({message:'err'}) }
});

// list characters
router.get('/', auth, async (req, res) => {
  const chars = await Character.find();
  // mark unlocked: defaultUnlocked or user has coins-unlocked logic (for demo, defaultUnlocked only)
  const data = chars.map(c => ({
    id: c._id,
    name: c.name,
    avatarUrl: c.avatarUrl,
    gender: c.gender,
    personality: c.personality,
    tags: c.tags,
    price: c.price,
    unlocked: c.defaultUnlocked // in prod track user-unlocks
  }));
  res.json(data);
});

// unlock character (deduct coins)
router.post('/unlock/:id', auth, async (req, res) => {
  try {
    const char = await Character.findById(req.params.id);
    if (!char) return res.status(404).json({ message: 'not found' });
    if (char.defaultUnlocked) return res.status(400).json({ message: 'already free' });
    if (req.user.coins < char.price) return res.status(400).json({ message: 'not enough coins' });
    req.user.coins -= char.price;
    await req.user.save();
    // in production track unlocked list per user
    res.json({ message: 'unlocked', coins: req.user.coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
