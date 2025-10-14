const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

// get current coin balance
router.get("/balance", auth, async (req, res) => {
  res.json({ coins: req.user.coins });
});

// 🎁 Reward: user watched ad successfully (verify via SDK in prod)
router.post("/reward/ad", auth, async (req, res) => {
  const REWARD = 20;
  req.user.coins += REWARD;
  await req.user.save();
  res.json({ message: "Ad watched, coins added!", coins: req.user.coins, added: REWARD });
});

// 💰 Buy coins (payment simulation)
router.post("/buy", auth, async (req, res) => {
  const { pack } = req.body; // e.g. '100', '500'
  const mapping = { '100': 100, '500': 500, '1000': 1000 };
  const add = mapping[pack] || 0;
  if (!add) return res.status(400).json({ message: "Invalid pack" });

  req.user.coins += add;
  await req.user.save();
  res.json({ message: "Coins purchased!", coins: req.user.coins, added: add });
});

// 🔓 Unlock a profile for 5 minutes
router.post("/unlock", auth, async (req, res) => {
  const { profileId } = req.body;
  const COST = 20;
  const DURATION_MS = 5 * 60 * 1000; // 5 minutes

  // Check if already unlocked
  const existing = req.user.unlockedProfiles.find(
    (p) => p.profileId === profileId && new Date(p.expiresAt) > new Date()
  );
  if (existing) return res.json({ message: "Profile already unlocked", expiresAt: existing.expiresAt });

  // Check coins
  if (req.user.coins < COST) {
    return res.status(400).json({ message: "Not enough coins. Watch ad or buy more!" });
  }

  // Deduct and unlock
  req.user.coins -= COST;
  req.user.unlockedProfiles.push({
    profileId,
    expiresAt: new Date(Date.now() + DURATION_MS),
  });

  await req.user.save();
  res.json({
    message: "Profile unlocked for 5 minutes!",
    coins: req.user.coins,
    expiresAt: new Date(Date.now() + DURATION_MS),
  });
});

// 🔍 Check if profile is unlocked
router.get("/unlock-status/:profileId", auth, async (req, res) => {
  const { profileId } = req.params;
  const unlocked = req.user.unlockedProfiles.find(
    (p) => p.profileId === profileId && new Date(p.expiresAt) > new Date()
  );

  res.json({ unlocked: !!unlocked, expiresAt: unlocked?.expiresAt || null });
});

module.exports = router;
