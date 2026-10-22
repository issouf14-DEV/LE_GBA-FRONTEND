import { IMAGE_RULES } from '@/lib/constants';

// Signatures binaires (« magic numbers ») : le contenu réel du fichier, pas son extension
const SIGNATURES = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46], extra: { offset: 8, text: 'WEBP' } },
];

function readHeader(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = () => reject(new Error("Impossible de lire l'image"));
    reader.readAsArrayBuffer(file.slice(0, 16));
  });
}

export function detectImageType(header) {
  const match = SIGNATURES.find(({ bytes, extra }) => {
    const prefixOk = bytes.every((byte, index) => header[index] === byte);
    if (!prefixOk || !extra) return prefixOk;
    const text = String.fromCharCode(
      ...header.slice(extra.offset, extra.offset + extra.text.length)
    );
    return text === extra.text;
  });
  return match?.mime ?? null;
}

function toDataUrl(file, mime) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Le type annoncé est remplacé par le type réellement détecté
      const base64 = String(reader.result).split(',')[1] ?? '';
      resolve(`data:${mime};base64,${base64}`);
    };
    reader.onerror = () => reject(new Error("Impossible de lire l'image"));
    reader.readAsDataURL(file);
  });
}

// Vérifie taille, type déclaré ET contenu réel, puis renvoie l'image en data URL (base64)
export async function readImageFile(file) {
  if (!file) throw new Error('Aucun fichier sélectionné');
  if (file.size > IMAGE_RULES.maxSize) throw new Error("L'image ne doit pas dépasser 2 Mo");
  if (!IMAGE_RULES.types.includes(file.type)) {
    throw new Error('Format non supporté (JPEG, PNG ou WebP uniquement)');
  }
  const mime = detectImageType(await readHeader(file));
  if (!mime) throw new Error("Ce fichier n'est pas une image valide");
  return toDataUrl(file, mime);
}
