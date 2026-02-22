const baseURL = import.meta.env.VITE_API_URL || '';
const uploadURL = baseURL ? `${baseURL}/api/uploads` : '/api/uploads';

/**
 * Upload image (JPEG/PNG, max 5MB). Returns file URL or throws.
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(uploadURL, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.filePath;
}
