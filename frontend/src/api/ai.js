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

/**
 * Get vaccination & care recommendations for a pet (public).
 * @param {string} petType - e.g. Dog, Cat, Bird, Other
 * @param {number} age - Age in years (0–30)
 * @param {string} [breed] - Optional breed (e.g. Labrador, Persian)
 * @returns {Promise<{ recommendations: string }>}
 */
export async function getPetRecommendations(petType, age, breed = '') {
  const body = { petType, age };
  if (breed && String(breed).trim()) body.breed = String(breed).trim();
  const { data } = await api.post('/ai/pet-recommendations', body);
  return data?.data ?? { recommendations: '' };
}
