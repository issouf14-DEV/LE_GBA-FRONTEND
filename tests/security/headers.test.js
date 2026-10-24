// Niveau 1 : en-têtes HTTP de production (vercel.json)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
// En-têtes appliqués à tout le site (route « /(.*) » qui continue vers les suivantes)
const headers = config.routes.find((route) => route.src === '/(.*)' && route.continue).headers;
const csp = Object.fromEntries(
  headers['Content-Security-Policy'].split(';').map((part) => {
    const [name, ...values] = part.trim().split(/\s+/);
    return [name, values];
  })
);

describe('En-têtes de sécurité', () => {
  it('interdit l’affichage du site dans une iframe (clickjacking)', () => {
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(csp['frame-ancestors']).toEqual(["'none'"]);
  });

  it('force HTTPS pendant au moins un an (HSTS)', () => {
    const maxAge = Number(/max-age=(\d+)/.exec(headers['Strict-Transport-Security'])[1]);
    expect(maxAge).toBeGreaterThanOrEqual(31_536_000);
    expect(csp['upgrade-insecure-requests']).toBeDefined();
  });

  it('empêche le navigateur de deviner le type des fichiers', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
  });

  it('isole la fenêtre et les ressources du site', () => {
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
    expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin');
  });

  it('coupe les API sensibles du navigateur', () => {
    for (const feature of ['camera', 'microphone', 'geolocation', 'payment']) {
      expect(headers['Permissions-Policy']).toContain(`${feature}=()`);
    }
  });
});

describe('Content-Security-Policy', () => {
  it('n’autorise que les scripts du site lui-même', () => {
    expect(csp['script-src']).toEqual(["'self'"]);
  });

  it('n’autorise ni eval ni scripts en ligne', () => {
    const all = headers['Content-Security-Policy'];
    expect(all).not.toContain("'unsafe-eval'");
    expect(csp['script-src']).not.toContain("'unsafe-inline'");
  });

  it('limite les appels réseau au site (API via /api)', () => {
    expect(csp['connect-src']).toEqual(["'self'"]);
  });

  it('bloque plugins, changement de base et envoi de formulaires ailleurs', () => {
    expect(csp['object-src']).toEqual(["'none'"]);
    expect(csp['base-uri']).toEqual(["'self'"]);
    expect(csp['form-action']).toEqual(["'self'"]);
  });

  it('ne contient aucun joker dangereux', () => {
    for (const [directive, values] of Object.entries(csp)) {
      if (directive === 'img-src') continue;
      expect(values, directive).not.toContain('*');
      expect(values, directive).not.toContain('https:');
    }
  });
});
