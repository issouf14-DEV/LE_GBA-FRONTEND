// Contrôle de sécurité du build de production (dist/) : rien de sensible ne doit être publié
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const DIST = 'dist';
const RULES = [
  { name: 'source map publiée', test: (file) => file.endsWith('.map') },
  { name: 'référence à une source map', pattern: /sourceMappingURL=/ },
  { name: 'clé secrète Stripe', pattern: /sk_(live|test)_[A-Za-z0-9]{10,}/ },
  { name: 'clé SendGrid', pattern: /SG\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/ },
  { name: 'clé privée', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'chaîne de connexion MongoDB', pattern: /mongodb(\+srv)?:\/\/[^"'\s]+@/ },
  { name: 'JWT en dur', pattern: /eyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\./ },
  { name: 'mot de passe en dur', pattern: /password123/ },
  { name: 'adresse du backend (doit passer par /api)', pattern: /le-gba-backend\.onrender\.com/ },
  { name: 'token dans le stockage du navigateur', pattern: /localStorage\.setItem\(\s*["']token/ },
  { name: 'token Bearer (la session passe par des cookies httpOnly)', pattern: /Bearer / },
  { name: 'instruction debugger', pattern: /\bdebugger\b/ },
];

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

if (!existsSync(DIST)) {
  console.error('dist/ introuvable : lancez « vite build » avant ce contrôle.');
  process.exit(1);
}

const problems = [];
for (const file of listFiles(DIST)) {
  const isText = ['.js', '.css', '.html', '.json', '.txt'].includes(extname(file));
  const content = isText ? readFileSync(file, 'utf8') : '';
  for (const rule of RULES) {
    const hit = rule.test ? rule.test(file) : rule.pattern.test(content);
    if (hit) problems.push(`${file} : ${rule.name}`);
  }
}

// Variantes CSS (.bloc--variante) définies dans style.css mais retirées du build par Tailwind
const MODIFIER = /\.[a-z][a-z-]*(?:__[a-z-]+)?--[a-z0-9-]+/g;
const builtCss = listFiles(DIST)
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(file, 'utf8'))
  .join('');
const built = new Set(builtCss.match(MODIFIER));
for (const name of new Set(readFileSync('src/styles/style.css', 'utf8').match(MODIFIER))) {
  if (!built.has(name)) problems.push(`${name} : classe absente du CSS (ajoutez-la au safelist)`);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problème(s) de sécurité dans le build.`);
  process.exit(1);
}

console.log('check-bundle : OK');
