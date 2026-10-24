export const PAGE_LIMIT = 100;
export const MAX_PAGES = 50;

// Liste extraite d'une réponse (tableau brut ou objet { [key]: [...] })
export const toList = (data, key) => {
  const list = Array.isArray(data) ? data : data?.[key];
  return Array.isArray(list) ? list : [];
};

// Récupère toutes les pages d'une liste paginée par le serveur (limit 100 maximum) :
// arrêt quand on a « total » éléments, une page vide ou incomplète, ou au garde-fou de 50 pages
export async function fetchAllPages(fetchPage, key) {
  const items = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await fetchPage({ page, limit: PAGE_LIMIT });
    const list = toList(data, key);
    items.push(...list);
    const total = Number(data?.total);
    if (Array.isArray(data) || list.length === 0) break;
    if (Number.isFinite(total) ? items.length >= total : list.length < PAGE_LIMIT) break;
    if (Number.isFinite(Number(data?.totalPages)) && page >= Number(data.totalPages)) break;
  }
  return items;
}
