// Revue visuelle : capture chaque page en ordinateur et en mobile (dossier passé en argument)
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import * as DEMO from './demo-data.mjs';
import { startAppServer } from './mock-server.mjs';

const OUT = process.argv[2] || 'screenshots';
const APP = 'http://localhost:4175';
const BROWSER = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);

const PUBLIC = [
  '/',
  '/vehicles',
  '/vehicles/v1',
  '/about',
  '/services',
  '/contact',
  '/login',
  '/register',
  '/forgot-password',
  '/page-inexistante',
];
const PRIVATE = [
  '/cart',
  '/checkout',
  '/profile/orders',
  '/order-history',
  '/profile',
  '/admin/dashboard',
  '/admin/vehicles',
  '/admin/orders',
  '/admin/users',
];
const VIEWPORTS = { desktop: { width: 1366, height: 900 }, mobile: { width: 390, height: 844 } };

mkdirSync(OUT, { recursive: true });
const server = await startAppServer(4175, DEMO);
const browser = await chromium.launch({ executablePath: BROWSER });
const problems = [];

const fileName = (device, path) =>
  `${device}${path === '/' ? '_accueil' : path.replaceAll('/', '_')}.png`;

for (const [device, viewport] of Object.entries(VIEWPORTS)) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', (e) => problems.push(`${device} erreur JS : ${e.message}`));

  const shoot = async (path) => {
    await page.goto(APP + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    if (overflow > 1) problems.push(`${device} ${path} : défilement horizontal de ${overflow}px`);
    await page.screenshot({ path: join(OUT, fileName(device, path)), fullPage: true });
  };

  for (const path of PUBLIC) await shoot(path);

  // Connexion puis panier rempli pour les pages privées
  await page.goto(`${APP}/login`, { waitUntil: 'networkidle' });
  await page.fill('#email', DEMO.USER.email);
  await page.fill('#password', 'Secret123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(800);
  await page.goto(`${APP}/vehicles`, { waitUntil: 'networkidle' });
  await page.locator('.vehicle-card__cta').first().click();
  await page.waitForTimeout(300);

  for (const path of PRIVATE) await shoot(path);
  await context.close();
}

await browser.close();
server.close();
console.log(problems.length ? problems.join('\n') : 'Aucun problème détecté automatiquement');
console.log(`Captures dans ${OUT}`);
