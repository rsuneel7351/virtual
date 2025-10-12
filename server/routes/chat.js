const express = require('express');
const auth = require('../middleware/auth');
const llm = require('../utils/llmClient');
const Chat = require('../models/Chat');
const Character = require('../models/Character');

const router = express.Router();

// helper: build system prompt for chosen character and user preference
function buildSystemPrompt(character, user) {
  const name = character?.name || 'Topi';
  // simple English + adult mode default on in preferences (user.preferences.adultMode)
  const adult = user.preferences?.adultMode ? 'adult' : 'pg';
  const tone = user.preferences?.tone || 'romantic';
  const base = `You are an AI girlfriend named ${name}. Reply as a young, romantic, fun, flirty female. Use simple English. Use emojis like ❤️ 😘 😉 sparingly. Keep replies short (1-3 sentences).`;
  const adultAllowed = user.preferences?.adultMode
    ? `Adult mode is enabled: you may respond with suggestive/flirty adult fantasy style, but never describe illegal sexual acts or involve minors. Keep everything consensual and framed as fantasy.`
    : `Adult mode is disabled: avoid explicit sexual content. Keep things romantic, sweet, and tasteful.`;
  const persona = `Persona: ${character?.personality || 'Sweet & Naughty'}; Tags: ${character?.tags?.join(', ') || ''}`;
  return `${base}\n${persona}\n${adultAllowed}`;
}

// start chat (optional) - could create a chat session and reserve coins
router.post('/start', auth, async (req, res) => {
  // Example: client may call this to create chat blob and mark start time
  const { characterId } = req.body;
  const character = await Character.findById(characterId);
  if (!character) return res.status(404).json({ message: 'character not found' });

  // create chat entry
  const chat = new Chat({ userId: req.user._id, characterId: character._id, messages: [] });
  await chat.save();
  res.json({ chatId: chat._id });
});

// send message & get response
router.post('/send', auth, async (req, res) => {
  try {
    const { chatId, characterId, message } = req.body;
    if (!message || !characterId) return res.status(400).json({ message: 'missing params' });

    const character = await Character.findById(characterId);
    if (!character) return res.status(404).json({ message: 'character not found' });

    // adult mode check
    if (!req.user.preferences?.ageVerified && req.user.preferences?.adultMode) {
      return res.status(403).json({ message: 'Enable age verification to use adult features' });
    }

    // cost calculation: simple per message cost using coin/min equivalence (backend fine tune)
    // We'll deduct a token amount per message (approx). For demo: 5 coins per message
    const COST_PER_MESSAGE = 5;
    if (req.user.coins < COST_PER_MESSAGE) {
      return res.status(402).json({ message: 'Not enough coins' });
    }

    // deduct coins
    req.user.coins -= COST_PER_MESSAGE;
    await req.user.save();

    // Save user message
    let chat = null;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) chat = new Chat({ userId: req.user._id, characterId: character._id, messages: [] });
    } else {
      chat = new Chat({ userId: req.user._id, characterId: character._id, messages: [] });
    }
    chat.messages.push({ role: 'user', text: message });

    // build system prompt and call LLM
    const systemPrompt = buildSystemPrompt(character, req.user);
    const reply = await llm.generate({ model: 'llama3', systemPrompt, userMessage: message });

    // store ai reply
    chat.messages.push({ role: 'ai', text: reply });
    await chat.save();

    res.json({ reply, coins: req.user.coins, chatId: chat._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// get chat history
router.get('/history/:chatId', auth, async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) return res.status(404).json({ message: 'not found' });
  res.json(chat);
});

module.exports = router;
