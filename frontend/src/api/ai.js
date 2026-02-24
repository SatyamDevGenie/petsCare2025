import api from './api.js';

/**
 * Send a message to the PetsCare FAQ AI assistant.
 * @param {string} message - User question (e.g. "How do I book?", "Where is the clinic?")
 * @returns {Promise<{ reply: string }>}
 */
export async function sendAiChat(message) {
  const { data } = await api.post('/ai/chat', { message });
  return data?.data ?? { reply: 'No reply received.' };
}
