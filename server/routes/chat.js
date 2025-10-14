const express = require('express');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const Character = require('../models/Character');

const router = express.Router();

function buildSystemPrompt(character, user) {
  const name = character?.name || 'Topi';
  const age = character?.age || 20;
  const gender = character?.gender || 'female';
  const orientation = character?.orientation || 'straight';
  const tone = user.preferences?.tone || 'friendly';
  const adultModeEnabled = user.preferences?.adultMode ?? false;

  // Dynamically describe character's persona
  const personaDesc = `You are an AI ${gender} companion named ${name}, age ${age}, oriented ${orientation}. Personality traits: ${character.personality?.join(', ') || 'friendly and playful'}. ${character.bio || ''}`;

  // Base prompt
  const base = `${personaDesc} Reply in a ${tone} tone. Use simple English, hinglish(if user want). Keep replies short (1-3 sentences). Use emojis like ❤️ 😘 😉 sparingly.`;

  // Adult content handling
  let adultAllowed;
  if (character.isAdult) {
    adultAllowed = adultModeEnabled
      ? `Adult mode is enabled: you may respond with suggestive/flirty/sexual, adult fantasy style, but never describe illegal sexual acts or involve minors. Keep everything consensual and framed as fantasy.`
      : `Adult content is restricted: keep replies appropriate, romantic, and tasteful.`;
  } else {
    adultAllowed = `This character is non-adult: avoid explicit sexual content. Keep things romantic, sweet, or playful.`;
  }

  // Persona & sample line metadata
  const personaMeta = `Sample Line: "${character.sampleLine || ''}"; Tags: ${character.tags?.join(', ') || ''}`;

  return `${base}\n${adultAllowed}\n${personaMeta}`;
}


router.post('/:characterId/message', auth, async (req, res) => {
  const { characterId } = req.params;
  const userId = req.user.id;
  const { text } = req.body;

  try {
    const character = await Character.findById(characterId);
    // if (!character) return res.status(404).json({ message: 'Character not found' });

    // // Get or create chat
    // let chat = await Chat.findOne({ userId, characterId });
    // if (!chat) chat = await Chat.create({ userId, characterId, messages: [] });

    // // Save user message
    // chat.messages.push({ role: 'user', text });
    // await chat.save();

    // Build system prompt dynamically from MongoDB

    // Prepare messages for Groq
    const messagesForAI = [
      { role: 'system', content: buildSystemPrompt() },
      // ...chat.messages.map(m => ({ role: m.role, content: m.text }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messagesForAI,
      model: 'moonshotai/kimi-k2-instruct-0905',
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 1,
    });

    let aiResponseText = '';
    for await (const chunk of chatCompletion) {
      aiResponseText += chunk.choices[0]?.delta?.content || '';
    }

    // // Save AI response
    // chat.messages.push({ role: 'ai', text: aiResponseText });
    // await chat.save();

    res.json({ message: aiResponseText });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// get chat history
router.get('/history/:chatId', auth, async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) return res.status(404).json({ message: 'not found' });
  res.json(chat);
});

module.exports = router;
