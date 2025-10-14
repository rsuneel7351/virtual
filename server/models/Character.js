const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  avatar: { type: String, required: true }, // image URL
  age: { type: Number, required: true },
  gender: { type: String, required: true }, // female/male/nonbinary
  orientation: { type: String, default: 'straight' }, // straight/lesbian/gay/bi
  personality: { type: [String], default: [] }, // array of traits
  bio: { type: String, default: '' },
  sampleLine: { type: String, default: '' },
  isAdult: { type: Boolean, default: false }, // true if contains bold/adult content
  isLocked: { type: Boolean, default: false }, // true if requires coins to unlock
  price: { type: Number, default: 0 }, // coins required to unlock
  rating: { type: Number, default: 0 }, // 0-5 rating
  prompt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Character', CharacterSchema);
