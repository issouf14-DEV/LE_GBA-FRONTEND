// Caractères invisibles (tabulation, retour à la ligne…) que les navigateurs suppriment des URL :
// « /\t/evil.com » deviendrait « //evil.com », donc un autre site
const hasControlChar = (text) =>
  [...text].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);

// N'accepte que les chemins internes (/page) pour éviter les redirections ouvertes
export function safeRedirect(target, fallback = '/') {
  if (typeof target !== 'string' || hasControlChar(target)) return fallback;
  const isInternal = target.startsWith('/') && !target.startsWith('//') && !target.includes('\\');
  return isInternal ? target : fallback;
}
