const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: String,
  avatarUrl: String,
  gender: String,
  orientationTags: [String],
  personality: String,
  tags: [String],
  price: { type: Number, default: 0 }, // coins to unlock if >0
  defaultUnlocked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Character', CharacterSchema);
