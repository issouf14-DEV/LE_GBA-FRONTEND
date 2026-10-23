// Vérifie chaque import local avec la casse exacte des fichiers suivis par Git.
// Windows ignore la casse (Admin = admin) mais pas Linux : sans ce contrôle,
// le build passe en local et échoue sur Vercel.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { posix } from 'node:path';

const tracked = new Set(execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean));
const EXTENSIONS = ['', '.js', '.jsx', '/index.js', '/index.jsx'];
const IMPORT = /(?:from\s+|import\(\s*)['"]((?:@\/|\.)[^'"]+)['"]/g;

const problems = [];
for (const file of tracked) {
  if (!/^src\/.*\.jsx?$/.test(file)) continue;
  for (const [, spec] of readFileSync(file, 'utf8').matchAll(IMPORT)) {
    const base = spec.startsWith('@/')
      ? `src/${spec.slice(2)}`
      : posix.join(posix.dirname(file), spec);
    if (!EXTENSIONS.some((ext) => tracked.has(base + ext))) {
      problems.push(`${file} : « ${spec} » introuvable dans Git (casse ou fichier non ajouté)`);
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} import(s) qui casseront le build sous Linux (Vercel).`);
  process.exit(1);
}

console.log('check-imports : OK');
