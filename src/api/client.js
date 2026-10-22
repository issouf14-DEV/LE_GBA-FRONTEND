import axios from 'axios';

// Toujours le même domaine que le site : Vite (dev) et Vercel (prod) relaient /api vers le backend.
// Les cookies de session (httpOnly, SameSite=Strict) restent ainsi internes au site.
export const client = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // En-tête exigé par le serveur sur les requêtes qui modifient des données (protection CSRF)
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Routes pour lesquelles un 401 ne déclenche pas de renouvellement de session
const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

let refreshing = null;

// Un seul renouvellement à la fois, partagé par toutes les requêtes en échec
function refreshSession() {
  refreshing ??= client.post('/auth/refresh').finally(() => {
    refreshing = null;
  });
  return refreshing;
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const canRefresh =
      error.response?.status === 401 &&
      request &&
      !request._retried &&
      !NO_REFRESH.some((path) => request.url?.startsWith(path));

    if (!canRefresh) return Promise.reject(error);

    request._retried = true;
    try {
      await refreshSession();
      return client(request);
    } catch {
      window.dispatchEvent(new CustomEvent('session-expired'));
      return Promise.reject(error);
    }
  }
);

// Message lisible pour l'utilisateur, quel que soit le type d'erreur
export function getErrorMessage(error, fallback = 'Une erreur est survenue. Veuillez réessayer.') {
  if (error?.code === 'ERR_NETWORK' || error?.code === 'ECONNABORTED') {
    return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  }
  if (error?.response?.status === 403) return 'Accès refusé.';
  if (error?.response?.status === 429)
    return 'Trop de tentatives. Réessayez dans quelques minutes.';
  return error?.response?.data?.message || fallback;
}

export default client;
