// N'autorise que des images sûres : https, chemin relatif au site, ou image base64 (png/jpeg/webp)
const SAFE_IMAGE = /^(https:\/\/|\/(?!\/)|data:image\/(png|jpe?g|webp);base64,)/i;

export const safeImageUrl = (value, fallback = null) =>
  typeof value === 'string' && SAFE_IMAGE.test(value.trim()) ? value.trim() : fallback;
