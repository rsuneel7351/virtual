const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema(
  {
    orientation: { type: String, default: "straight" },
    prefGender: { type: String, default: "female" },
    tone: { type: [String], default: ["romantic"] },
    adultMode: { type: Boolean, default: true },
    ageVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

// 🧩 New sub-schema for unlocked profiles
const UnlockedProfileSchema = new mongoose.Schema(
  {
    profileId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

// 🧩 Optional: Track ad rewards for future limits
const AdHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    rewardGiven: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String },

  coins: { type: Number, default: parseInt(process.env.COINS_INITIAL || "100") },

  preferences: { type: PreferenceSchema, default: {} },

  // 🪙 New fields:
  unlockedProfiles: { type: [UnlockedProfileSchema], default: [] },
  adHistory: { type: [AdHistorySchema], default: [] },

  gender: { type: String, default: "male" },
  hasCompletedOnboarding: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null }
});

module.exports = mongoose.model("User", UserSchema);
