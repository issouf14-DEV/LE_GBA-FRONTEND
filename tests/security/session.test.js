// Niveau 5 : session par cookies httpOnly, renouvellement automatique, aucun token côté JS
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { client } from '@/api/client';
import { buildUser, purgeLegacyStorage, saveLocalPhoto } from '@/features/auth/lib/session';

let calls;
let routes;

// Faux serveur : chaque route renvoie un statut, éventuellement différent à chaque appel
function fakeAdapter(config) {
  calls.push(`${config.method.toUpperCase()} ${config.url}`);
  const queue = routes[config.url] ?? [200];
  const status = queue.length > 1 ? queue.shift() : queue[0];
  const response = { data: { ok: true }, status, statusText: '', headers: {}, config };
  if (status >= 400) {
    const error = new Error(`HTTP ${status}`);
    Object.assign(error, { config, response, isAxiosError: true });
    return Promise.reject(error);
  }
  return Promise.resolve(response);
}

beforeEach(() => {
  calls = [];
  routes = {};
  client.defaults.adapter = fakeAdapter;
});
afterEach(() => localStorage.clear());

describe('Configuration du client HTTP', () => {
  it('appelle /api sur le même domaine, cookies inclus', () => {
    expect(client.defaults.baseURL).toBe('/api');
    expect(client.defaults.withCredentials).toBe(true);
  });

  it('envoie l’en-tête anti-CSRF et aucun en-tête Authorization', async () => {
    let sent;
    client.defaults.adapter = (config) => {
      sent = config.headers;
      return fakeAdapter(config);
    };
    await client.post('/orders', {});
    expect(sent['X-Requested-With']).toBe('XMLHttpRequest');
    expect(sent.Authorization).toBeUndefined();
  });
});

describe('Renouvellement de session (token d’accès de 15 min)', () => {
  it('401 : renouvelle puis rejoue la requête une seule fois', async () => {
    routes['/orders/mine'] = [401, 200];
    await client.get('/orders/mine');
    expect(calls).toEqual(['GET /orders/mine', 'POST /auth/refresh', 'GET /orders/mine']);
  });

  it('plusieurs 401 simultanés : un seul renouvellement', async () => {
    routes['/a'] = [401, 200];
    routes['/b'] = [401, 200];
    routes['/c'] = [401, 200];
    await Promise.all(['/a', '/b', '/c'].map((url) => client.get(url)));
    expect(calls.filter((call) => call === 'POST /auth/refresh')).toHaveLength(1);
  });

  it('renouvellement refusé : session fermée, pas de boucle', async () => {
    routes['/orders/mine'] = [401];
    routes['/auth/refresh'] = [401];
    const expired = vi.fn();
    window.addEventListener('session-expired', expired);
    await expect(client.get('/orders/mine')).rejects.toThrow('401');
    window.removeEventListener('session-expired', expired);
    expect(expired).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(['GET /orders/mine', 'POST /auth/refresh']);
  });

  it('toujours 401 après renouvellement : pas de seconde tentative', async () => {
    routes['/orders/mine'] = [401];
    await expect(client.get('/orders/mine')).rejects.toThrow('401');
    expect(calls).toEqual(['GET /orders/mine', 'POST /auth/refresh', 'GET /orders/mine']);
  });

  it.each(['/auth/login', '/auth/register', '/auth/logout'])(
    'un 401 sur %s ne déclenche pas de renouvellement',
    async (url) => {
      routes[url] = [401];
      await expect(client.post(url, {})).rejects.toThrow('401');
      expect(calls).toEqual([`POST ${url}`]);
    }
  );
});

describe('Aucun secret dans le navigateur', () => {
  it('les anciens tokens et profils sont purgés', () => {
    for (const key of ['token', 'user', 'userProfiles', 'pendingOrders']) {
      localStorage.setItem(key, 'ancien');
    }
    purgeLegacyStorage();
    expect(Object.keys(localStorage)).toEqual([]);
  });

  it('seule la photo est conservée, jamais rôle, téléphone ou adresse', () => {
    const photo = 'data:image/png;base64,iVBORw0KGgo=';
    saveLocalPhoto({
      email: 'a@b.co',
      role: 'admin',
      phone: '0102',
      address: 'Cocody',
      profileImage: photo,
    });
    expect(Object.keys(localStorage)).toEqual(['userProfile']);
    expect(JSON.parse(localStorage.getItem('userProfile'))).toEqual({
      email: 'a@b.co',
      profileImage: photo,
    });
  });
});

describe('Données utilisateur renvoyées par le serveur', () => {
  it('un rôle inconnu est ramené au rôle le plus faible', () => {
    const user = buildUser({ _id: 'u1', email: 'a@b.co', role: 'superadmin' });
    expect(user.role).toBe('user');
  });

  it('une photo javascript: est neutralisée', () => {
    const user = buildUser({ _id: 'u1', email: 'a@b.co', profileImage: 'javascript:alert(1)' });
    expect(user.profileImage).toBeNull();
  });

  it('une réponse sans email est refusée', () => {
    expect(() => buildUser({ _id: 'u1', role: 'admin' })).toThrow();
  });
});
