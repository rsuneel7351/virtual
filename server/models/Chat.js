const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai'], required: true },
  text: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
