const axios = require('axios');

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'ollama';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const LLM_API_KEY = process.env.LLM_API_KEY || '';

async function generateFromOllama(model, systemPrompt, userMessage) {
  const prompt = `${systemPrompt}\nUser: ${userMessage}\n${process.env.CHARACTER_NAME || 'Girlfriend'}:`;
  // Ollama generate endpoint contract
  const body = {
    model: model || 'llama3',
    prompt: prompt,
    max_tokens: 512,
    temperature: 0.8
  };
  const res = await axios.post(`${OLLAMA_URL}/api/generate`, body, { timeout: 120000 });
  // Ollama may respond with a structured object; adapt to your version
  if (res.data && res.data.response) return res.data.response;
  if (res.data && res.data.text) return res.data.text;
  // fallback
  return (typeof res.data === 'string') ? res.data : JSON.stringify(res.data);
}

async function generateFromExternal(systemPrompt, userMessage) {
  // generic external provider: expecting LLM_API_KEY and endpoint usage
  // This is a placeholder. Integrate actual Groq/OpenRouter/HF SDK per their docs.
  const endpoint = process.env.LLM_API_URL;
  if (!endpoint || !LLM_API_KEY) throw new Error('External provider not configured');
  const body = {
    prompt: `${systemPrompt}\nUser: ${userMessage}\nGirlfriend:`,
    max_tokens: 512,
    temperature: 0.8
  };
  const res = await axios.post(endpoint, body, { headers: { Authorization: `Bearer ${LLM_API_KEY}` }, timeout: 120000 });
  if (res.data && res.data.output) return res.data.output;
  if (res.data && res.data.choices && res.data.choices[0]) return res.data.choices[0].text || res.data.choices[0].message?.content;
  return JSON.stringify(res.data);
}

module.exports = {
  generate: async (options) => {
    const { model, systemPrompt, userMessage } = options;
    if (LLM_PROVIDER === 'ollama') {
      return generateFromOllama(model, systemPrompt, userMessage);
    } else {
      return generateFromExternal(systemPrompt, userMessage);
    }
  }
};
