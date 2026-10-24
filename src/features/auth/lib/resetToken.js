// Format attendu du jeton de réinitialisation (base64url, généré par le serveur)
export const RESET_TOKEN_PATTERN = /^[A-Za-z0-9_-]{40,100}$/;

export const isResetToken = (value) => typeof value === 'string' && RESET_TOKEN_PATTERN.test(value);

// Ordre de lecture : ancien paramètre /:token, fragment #jeton, puis état de navigation
export function readResetToken({ param, hash, state } = {}) {
  const fromHash = typeof hash === 'string' ? hash.replace(/^#/, '') : '';
  const candidate = param || fromHash || state?.token;
  return isResetToken(candidate) ? candidate : null;
}
