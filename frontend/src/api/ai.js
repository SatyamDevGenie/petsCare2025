import api, { getAuthConfig } from './api.js';

/**
 * Send a message to the PetsCare FAQ AI assistant.
 * @param {string} message - User question (e.g. "How do I book?", "Where is the clinic?")
 * @returns {Promise<{ reply: string }>}
 */
export async function sendAiChat(message) {
  const { data } = await api.post('/ai/chat', { message });
  return data?.data ?? { reply: 'No reply received.' };
}

/**
 * Summarize visit notes for pet owner (Doctor or Admin only). Requires auth.
 * @param {string} notes - Raw visit notes
 * @param {function} getState - Redux getState (e.g. useStore().getState)
 * @returns {Promise<{ summary: string }>}
 */
export async function summarizeVisitNotes(notes, getState) {
  const config = getState ? getAuthConfig(getState) : {};
  const { data } = await api.post('/ai/summarize-notes', { notes }, config);
  return data?.data ?? { summary: '' };
}
