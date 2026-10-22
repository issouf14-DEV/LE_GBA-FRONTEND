// Formats d'affichage partagés (prix en FCFA, dates en français)
const priceFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export function formatPrice(value) {
  const amount = Number(value);
  return `${priceFormatter.format(Number.isFinite(amount) ? amount : 0)} FCFA`;
}

const toDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const DATE_STYLES = {
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
};

export function formatDate(value, style = 'long', fallback = '-') {
  const date = toDate(value);
  return date ? date.toLocaleDateString('fr-FR', DATE_STYLES[style]) : fallback;
}

export function formatDateTime(value, fallback = '-') {
  const date = toDate(value);
  return date
    ? date.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : fallback;
}

// Nombre de jours de location (minimum 1)
export function daysBetween(start, end) {
  const from = toDate(start);
  const to = toDate(end);
  if (!from || !to) return 0;
  return Math.max(1, Math.ceil((to - from) / 86_400_000));
}

export function truncate(text = '', length = 100) {
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

// « Il y a 5 min », « Il y a 2 h »…
export function timeAgo(value) {
  const date = toDate(value);
  if (!date) return '';
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (minutes < 1440) return `Il y a ${Math.floor(minutes / 60)} h`;
  return `Il y a ${Math.floor(minutes / 1440)} j`;
}

// Axe de graphique : « 200 k », « 1,5 M » (le montant exact reste dans l'infobulle)
const compactFormatter = new Intl.NumberFormat('fr-FR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
export const formatCompact = (value) => compactFormatter.format(Number(value) || 0);
