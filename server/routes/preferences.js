const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  res.json({ preferences: req.user.preferences });
});

router.post('/', auth, async (req, res) => {
  try {
    const { orientation, tone, adultMode, ageVerified } = req.body;
    req.user.preferences = {
      orientation: orientation || req.user.preferences.orientation,
      prefGender: prefGender || req.user.preferences.prefGender,
      tone: tone || req.user.preferences.tone,
      adultMode: typeof adultMode === 'boolean' ? adultMode : req.user.preferences.adultMode,
      ageVerified: typeof ageVerified === 'boolean' ? ageVerified : req.user.preferences.ageVerified
    };
    await req.user.save();
    res.json({ preferences: req.user.preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
