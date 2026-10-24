// Proxy /api de Vercel (vercel.json) : secret X-Proxy-Auth ajouté côté serveur, jamais dans le code
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const raw = readFileSync('vercel.json', 'utf8');
const config = JSON.parse(raw);
const apiRoutes = config.routes.filter((route) => route.src?.startsWith('^/api'));
const api = apiRoutes[0];
const secretTransform = api.transforms.find(
  (t) => t.type === 'request.headers' && t.target?.key === 'x-proxy-auth'
);
const globalHeaders = config.routes.find(
  (route) => route.src === '/(.*)' && route.continue
).headers;

describe('Route /api vers le backend', () => {
  it('existe une seule fois, en HTTPS, en conservant le chemin', () => {
    expect(apiRoutes).toHaveLength(1);
    expect(api.dest).toMatch(/^https:\/\/[^/]+\/api\/\$1$/);
    expect(api.continue).toBeUndefined();
  });

  it('n’utilise que « routes » (Vercel refuse le mélange avec rewrites/headers)', () => {
    expect(Object.keys(config).sort()).toEqual(['$schema', 'routes']);
  });

  it('passe avant les fichiers statiques et la page SPA, qui reste la dernière règle', () => {
    const index = (predicate) => config.routes.findIndex(predicate);
    const filesystem = index((route) => route.handle === 'filesystem');
    expect(index((route) => route === api)).toBeLessThan(filesystem);
    expect(config.routes.at(-1)).toEqual({ src: '/(.*)', dest: '/index.html' });
    expect(filesystem).toBe(config.routes.length - 2);
  });
});

describe('Secret X-Proxy-Auth', () => {
  it('remplace toute valeur envoyée par le client (op set)', () => {
    expect(secretTransform.op).toBe('set');
  });

  it('vient uniquement de la variable d’environnement PROXY_SECRET', () => {
    expect(secretTransform.args).toBe('$PROXY_SECRET');
    expect(secretTransform.env).toEqual(['PROXY_SECRET']);
  });

  it('n’est écrit en clair nulle part dans vercel.json', () => {
    const values = JSON.stringify(api.transforms.map((t) => t.args));
    expect(values).toBe('["$PROXY_SECRET"]');
    expect(raw).not.toMatch(/[A-Za-z0-9+/=_]{32,}/);
  });

  it('n’est pas renvoyé au navigateur dans les en-têtes de réponse', () => {
    const responseKeys = Object.keys(api.headers).map((key) => key.toLowerCase());
    expect(responseKeys).not.toContain('x-proxy-auth');
    const responseTransforms = api.transforms.filter((t) => t.type === 'response.headers');
    expect(responseTransforms).toHaveLength(0);
  });
});

describe('Réponses de l’API', () => {
  it('gardent les en-têtes de sécurité essentiels, identiques au reste du site', () => {
    const essentials = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Strict-Transport-Security',
      'Cross-Origin-Resource-Policy',
      'X-Permitted-Cross-Domain-Policies',
    ];
    for (const key of essentials) expect(api.headers[key], key).toBe(globalHeaders[key]);
  });

  it('ne touchent pas aux cookies ni à X-Forwarded-For (relayés par Vercel)', () => {
    const touched = api.transforms.map((t) => String(t.target?.key).toLowerCase());
    for (const key of ['cookie', 'set-cookie', 'x-forwarded-for', 'x-real-ip']) {
      expect(touched).not.toContain(key);
    }
  });
});
