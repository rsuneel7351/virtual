const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai', 'system'],
    required: true
  },
  text: { type: String, required: true },
  tokens: { type: Number, default: 0 }, // optional: token usage tracking
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  characterId: {
    type:String,
    ref: 'Character',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Chat'
  },
  messages: [MessageSchema],

  lastMessagePreview: { type: String }, // quick fetch for dashboard
  lastMessageAt: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// keep `updatedAt` and `lastMessageAt` automatically refreshed
ChatSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (this.messages?.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].createdAt;
    this.lastMessagePreview = this.messages[this.messages.length - 1].text.slice(0, 80);
  }
  next();
});

module.exports = mongoose.model('Chat', ChatSchema);
