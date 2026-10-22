// Audit d'accessibilité (axe-core, règles WCAG 2.1 AA) de chaque page dans un vrai navigateur
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import * as DEMO from './demo-data.mjs';
import { startAppServer } from './mock-server.mjs';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const APP = 'http://localhost:4177';
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

const server = await startAppServer(4177, DEMO);
const browser = await chromium.launch({ executablePath: BROWSER });
// La CSP du site bloque (à juste titre) l'injection d'axe : contournée pour l'audit uniquement
const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, bypassCSP: true });
const findings = new Map();

async function audit(path) {
  await page.goto(APP + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.addScriptTag({ content: AXE });
  const result = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    })
  );
  for (const v of result.violations) {
    const entry = findings.get(v.id) || {
      impact: v.impact,
      help: v.help,
      pages: new Set(),
      samples: new Set(),
    };
    entry.pages.add(path);
    const limit = process.env.A11Y_DETAIL === v.id ? 50 : 2;
    for (const node of v.nodes.slice(0, limit)) {
      const ratio = node.any?.[0]?.data?.contrastRatio;
      const colors = node.any?.[0]?.data
        ? ` (${node.any[0].data.fgColor} sur ${node.any[0].data.bgColor}, ${ratio})`
        : '';
      const html = limit > 2 ? ` ${node.html.slice(0, 160)}` : '';
      entry.samples.add(node.target.join(' ') + (limit > 2 ? colors : '') + html);
    }
    findings.set(v.id, entry);
  }
}

for (const path of PUBLIC) await audit(path);
await page.goto(`${APP}/login`, { waitUntil: 'networkidle' });
await page.fill('#email', DEMO.USER.email);
await page.fill('#password', 'Secret123');
await page.click('button[type="submit"]');
await page.waitForTimeout(800);
await page.goto(`${APP}/vehicles`, { waitUntil: 'networkidle' });
await page.locator('.vehicle-card__cta').first().click();
for (const path of PRIVATE) await audit(path);

await browser.close();
server.close();

const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const sorted = [...findings.entries()].sort((a, b) => order[a[1].impact] - order[b[1].impact]);
for (const [id, f] of sorted) {
  console.log(`[${f.impact}] ${id} : ${f.help}`);
  console.log(`   pages : ${[...f.pages].join(', ')}`);
  console.log(`   ex. : ${[...f.samples].slice(0, 3).join(' | ')}`);
}
console.log(`\n${findings.size} type(s) de problème d'accessibilité`);
process.exit(findings.size ? 1 : 0);
