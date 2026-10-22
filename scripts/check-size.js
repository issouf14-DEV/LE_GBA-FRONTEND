// Garde-fou qualité : fichiers JS/JSX de 150 lignes max, sans émoji ni react-icons
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = 'src';
const MAX_LINES = 150;
const IGNORED = [join('src', 'components', 'ui')];
const EMOJI = /(?![©®™])\p{Extended_Pictographic}/u;

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (IGNORED.some((ignored) => path.startsWith(ignored))) return [];
    if (statSync(path).isDirectory()) return listFiles(path);
    return ['.js', '.jsx'].includes(extname(path)) ? [path] : [];
  });
}

const problems = [];

for (const file of listFiles(ROOT)) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const name = relative('.', file);

  if (lines.length > MAX_LINES)
    problems.push(`${name} : ${lines.length} lignes (max ${MAX_LINES})`);
  if (content.includes('react-icons'))
    problems.push(`${name} : import react-icons (utiliser lucide-react)`);

  lines.forEach((line, index) => {
    if (EMOJI.test(line)) problems.push(`${name}:${index + 1} : émoji interdit`);
  });
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problème(s) trouvé(s).`);
  process.exit(1);
}

console.log('check-size : OK');
