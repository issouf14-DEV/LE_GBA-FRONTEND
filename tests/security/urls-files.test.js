// Niveau 4 : redirections, URL d'images et fichiers envoyés
import { describe, expect, it } from 'vitest';
import { detectImageType, readImageFile } from '@/lib/image';
import { safeRedirect } from '@/lib/safeRedirect';
import { safeImageUrl } from '@/lib/safeUrl';

const BACKSLASH = String.fromCharCode(92);

describe('Redirection après connexion (open redirect)', () => {
  it.each(['/profile', '/vehicles?type=electric', '/admin/orders'])('« %s » accepté', (path) => {
    expect(safeRedirect(path)).toBe(path);
  });

  it.each([
    '//evil.example',
    'https://evil.example',
    'javascript:alert(1)',
    `/${BACKSLASH}evil.example`,
    `${BACKSLASH}${BACKSLASH}evil.example`,
    '/\t/evil.example',
    '/\n/evil.example',
    '/\r/evil.example',
    ' /profile',
    'profile',
    '',
  ])('« %j » refusé', (target) => {
    expect(safeRedirect(target)).toBe('/');
  });

  it.each([null, undefined, 42, { pathname: '//evil' }, ['/x']])('valeur non texte %j', (t) => {
    expect(safeRedirect(t)).toBe('/');
  });
});

describe('URL d’images', () => {
  it.each([
    'https://cdn.example.com/a.jpg',
    '/uploads/a.png',
    'data:image/png;base64,iVBORw0KGgo=',
    'data:image/webp;base64,UklGRg==',
  ])('« %s » acceptée', (url) => expect(safeImageUrl(url)).toBe(url));

  it.each([
    'javascript:alert(1)',
    ' JAVASCRIPT:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'data:image/svg+xml;base64,PHN2Zz4=',
    'http://insecure.example/a.png',
    '//evil.example/a.png',
    'file:///etc/passwd',
  ])('« %s » refusée', (url) => expect(safeImageUrl(url, 'SECOURS')).toBe('SECOURS'));
});

const file = (bytes, type, size) => {
  const blob = new File([new Uint8Array(bytes)], 'photo', { type });
  if (size) Object.defineProperty(blob, 'size', { value: size });
  return blob;
};
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0];
const JPEG = [0xff, 0xd8, 0xff, 0xe0, 0, 0];
const WEBP = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
const SVG = [...new TextEncoder().encode('<svg onload="alert(1)"></svg>')];
const HTML = [...new TextEncoder().encode('<html><script>alert(1)</script>')];

describe('Signature binaire des images', () => {
  it('reconnaît PNG, JPEG et WebP', () => {
    expect(detectImageType(new Uint8Array(PNG))).toBe('image/png');
    expect(detectImageType(new Uint8Array(JPEG))).toBe('image/jpeg');
    expect(detectImageType(new Uint8Array(WEBP))).toBe('image/webp');
  });

  it('accepte une vraie image PNG', async () => {
    const url = await readImageFile(file(PNG, 'image/png'));
    expect(url.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('corrige le type quand l’extension ment (JPEG déclaré PNG)', async () => {
    const url = await readImageFile(file(JPEG, 'image/png'));
    expect(url.startsWith('data:image/jpeg;base64,')).toBe(true);
  });

  it.each([
    ['SVG renommé en .png', SVG],
    ['page HTML renommée en .png', HTML],
  ])('refuse un %s', async (_label, bytes) => {
    await expect(readImageFile(file(bytes, 'image/png'))).rejects.toThrow('pas une image');
  });

  it('refuse un type non autorisé (SVG déclaré)', async () => {
    await expect(readImageFile(file(SVG, 'image/svg+xml'))).rejects.toThrow('Format');
  });

  it('refuse une image de plus de 2 Mo', async () => {
    await expect(readImageFile(file(PNG, 'image/png', 3 * 1024 * 1024))).rejects.toThrow('2 Mo');
  });
});
