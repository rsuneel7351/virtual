const express = require('express');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const Character = require('../models/Character');
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const router = express.Router();

// 🧠 Build AI system prompt dynamically
function buildSystemPrompt(character, user) {
  const name = character?.name || 'Topi';
  const age = character?.age || 20;
  const gender = character?.gender || 'female';
  const orientation = character?.orientation || 'straight';
  const tone = user?.preferences?.tone || 'friendly';
  const adultModeEnabled = user?.preferences?.adultMode ?? false;
  const userName = user?.username || 'User';

  const personaDesc = `
You are an AI ${gender} companion named ${name}, age ${age}, oriented ${orientation}.
Personality traits: ${character.personality?.join(', ') || 'friendly and playful'}.
${character.bio || ''}
`;

  const base = `
${personaDesc}
Your task is to chat naturally with ${userName}. 
Always address them by name ("${userName}") in a natural, caring, or romantic way depending on tone.
Reply in a ${tone} tone. 
Use short sentences (1–3 max), mix English + Hinglish naturally.
Use emojis ❤️ 😘 😉 sparingly and only when it fits the vibe.
`;

  const adultAllowed = character.isAdult
    ? (user?.preferences?.adultMode
      ? `Adult mode enabled: you may respond with flirty or romantic fantasy elements.`
      : `Adult content restricted: keep replies romantic, emotional, and tasteful.`)
    : `This character is non-adult: avoid explicit sexual content. Keep things sweet or playful.`;

  const personaMeta = `
Sample Line: "${character.sampleLine || ''}"
Tags: ${character.tags?.join(', ') || ''}
`;

  const nameRule = `
Every few messages, naturally mention ${userName}'s name in your replies so the conversation feels personal.
`;

  return `${base}\n${adultAllowed}\n${personaMeta}\n${nameRule}`;
}

// 🧩 Send message
router.post('/:characterId/message', auth, async (req, res) => {
  const { characterId } = req.params;
  const { text, chatId } = req.body;

  try {
    const character = await Character.findById(characterId);
    if (!character) return res.status(404).json({ message: 'Character not found' });

    const systemPrompt = buildSystemPrompt(character, req.user);

    // 🧠 Fetch existing chat or create one
    let chat = chatId
      ? await Chat.findById(chatId)
      : await Chat.findOne({ userId: req.user._id, characterId });

    if (!chat) {
      chat = new Chat({
        userId: req.user._id,
        characterId,
        messages: [],
      });
    }

    // 📜 Add new user message to DB
    chat.messages.push({ role: 'user', text });

    // 🧠 Prepare recent messages for context
    const contextLimit = character.isLocked ? 4 : 2;
    const recentMessages = chat.messages.slice(-contextLimit * 2); // include user & ai pairs

    const contextMessages = recentMessages.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }));
    console.log(contextMessages, 'contextMessages')
    // ⚡ Send request to Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...contextMessages,
        { role: 'user', content: text },
      ],
      model: 'moonshotai/kimi-k2-instruct-0905',
      temperature: 0.6,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const aiResponseText =
      chatCompletion.choices?.[0]?.message?.content?.trim() ||
      "I'm not sure what to say right now 🥺";

    // 💾 Save AI message too
    chat.messages.push({ role: 'ai', text: aiResponseText });
    await chat.save();

    res.json({
      message: aiResponseText,
      chatId: chat._id,
      messages: chat.messages.slice(-2), // last exchange
    });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📜 Get chat history
router.get('/history/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    console.log(error.message)
  }
});

module.exports = router;
