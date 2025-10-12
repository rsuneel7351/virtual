const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// get balance
router.get('/balance', auth, async (req, res) => {
  res.json({ coins: req.user.coins });
});

// simulate watch ad reward (server should verify real ad in prod)
router.post('/reward/ad', auth, async (req, res) => {
  // For demo: allow up to 5 ads per day. Minimal tracking stored in-memory or DB is needed; simple example:
  // We'll skip daily-limit enforcement here; implement in prod.
  const REWARD = 20;
  req.user.coins += REWARD;
  await req.user.save();
  res.json({ coins: req.user.coins, added: REWARD });
});

// simulate buying coins (you will integrate payment gateway)
router.post('/buy', auth, async (req, res) => {
  // in prod: create payment order (Razorpay/Stripe) and on success credit coins
  const { pack } = req.body; // e.g., '100' '500'
  const mapping = { '100': 100, '500': 500, '1000': 1000 };
  const add = mapping[pack] || 0;
  if (!add) return res.status(400).json({ message: 'invalid pack' });
  // For demo, instantly credit (replace with webhook in prod)
  req.user.coins += add;
  await req.user.save();
  res.json({ coins: req.user.coins, added: add });
});

module.exports = router;
