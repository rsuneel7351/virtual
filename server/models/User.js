const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  orientation: { type: String, default: 'straight' },
  prefGender: { type: String, default: 'female' },
  tone: { type: String, default: 'romantic' },
  adultMode: { type: Boolean, default: true }, // you wanted default adult on
  ageVerified: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String },
  coins: { type: Number, default: parseInt(process.env.COINS_INITIAL || '100') },
  preferences: { type: PreferenceSchema, default: {} },
  createdAt: { type: Date, default: Date.now },
  gender: { type: String, required: false, default: "male" },
  hasCompletedOnboarding: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
