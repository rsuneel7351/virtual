const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    res.json({ preferences: req.user.preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { orientation, companionGender, tonePreference, adultMode, ageVerified } = req.body;

    req.user.preferences = {
      orientation: orientation || req.user.preferences.orientation,
      prefGender: companionGender || req.user.preferences.prefGender,
      tone: Array.isArray(tonePreference) ? tonePreference.join(', ') : tonePreference || req.user.preferences.tone,
      adultMode: typeof adultMode === 'boolean' ? adultMode : req.user.preferences.adultMode,
      ageVerified: typeof ageVerified === 'boolean' ? ageVerified : req.user.preferences.ageVerified,
    };

    req.user.hasCompletedOnboarding = true;
    await req.user.save();

    res.json({ preferences: req.user.preferences, hasCompletedOnboarding: true });
  } catch (err) {
    console.error('Error saving preferences:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
