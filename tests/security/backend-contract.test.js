// Niveau 9 : contrat avec le backend (statuts stricts, jeton de réinitialisation, pagination)
import { describe, expect, it, vi } from 'vitest';
import { fetchAllPages, MAX_PAGES } from '@/api/pagination';
import { toDashboardStats } from '@/features/admin/dashboard/lib/stats';
import { readResetToken } from '@/features/auth/lib/resetToken';
import { normalizeStatus, ORDER_STATUSES } from '@/features/orders/lib/orderStatus';

const TOKEN = 'a'.repeat(30) + 'B_-9'.repeat(5);

describe('Statuts de commande stricts', () => {
  it('seuls les cinq statuts du backend existent', () =>
    expect(Object.keys(ORDER_STATUSES).sort()).toEqual(
      ['annulee', 'en_attente', 'rejetee', 'terminee', 'validee'].sort()
    ));
  it.each(['validee', 'rejetee', 'annulee', 'terminee'])('« %s » conservé', (status) =>
    expect(normalizeStatus(status)).toBe(status)
  );
  it.each(['en_cours', 'pending', 'completed', 'cancelled', 'VALIDEE', null, 3, {}])(
    '« %s » ramené à en_attente',
    (status) => expect(normalizeStatus(status)).toBe('en_attente')
  );
});

describe('Jeton de réinitialisation', () => {
  it('lu depuis le fragment #', () => expect(readResetToken({ hash: `#${TOKEN}` })).toBe(TOKEN));
  it('ancien format /:token et état de navigation acceptés', () => {
    expect(readResetToken({ param: TOKEN })).toBe(TOKEN);
    expect(readResetToken({ state: { token: TOKEN } })).toBe(TOKEN);
  });
  it.each(['#court', `#${TOKEN}<script>`, `#${'a'.repeat(101)}`, '', '#'])(
    'fragment « %s » refusé',
    (hash) => expect(readResetToken({ hash })).toBeNull()
  );
  it('un état forgé (objet) est refusé', () =>
    expect(readResetToken({ state: { token: { $ne: null } } })).toBeNull());
});

describe('Récupération de toutes les pages', () => {
  const pages =
    (total) =>
    async ({ page, limit }) => {
      const start = (page - 1) * limit;
      const length = Math.max(0, Math.min(limit, total - start));
      return { users: Array.from({ length }, (_, i) => start + i), total, page, limit };
    };

  it('assemble toutes les pages jusqu’au total', async () => {
    const list = await fetchAllPages(pages(250), 'users');
    expect(list).toHaveLength(250);
    expect(list.at(-1)).toBe(249);
  });

  it('s’arrête sur une page vide', async () => {
    const fetchPage = vi.fn(async ({ page }) => ({ users: page === 1 ? [1] : [], total: 999 }));
    expect(await fetchAllPages(fetchPage, 'users')).toEqual([1]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('garde-fou : au plus 50 pages', async () => {
    const fetchPage = vi.fn(async () => ({ users: Array(100).fill(0), total: 1e9 }));
    await fetchAllPages(fetchPage, 'users');
    expect(fetchPage).toHaveBeenCalledTimes(MAX_PAGES);
  });

  it('une réponse invalide donne une liste vide', async () =>
    expect(await fetchAllPages(async () => ({ users: 'x' }), 'users')).toEqual([]));
});

describe('Statistiques du tableau de bord', () => {
  const stats = toDashboardStats({
    totalOrders: 4,
    totalRevenue: '-5',
    byStatus: { en_attente: 2, validee: 0, terminee: 2, constructor: 9 },
    monthly: [{ year: 2026, month: 1, revenus: 1000, commandes: 2 }],
    recentOrders: [{ _id: 'o1', status: 'en_cours' }],
  });

  it('séries mensuelles avec mois courts en français', () => {
    expect(stats.monthly).toEqual([{ name: 'janv.', revenus: 1000 }]);
    expect(stats.monthlyOrders).toEqual([{ name: 'janv.', commandes: 2 }]);
  });
  it('statuts à zéro et clés inconnues écartés', () =>
    expect(stats.byStatus).toEqual([
      { name: 'En attente', value: 2 },
      { name: 'Terminée', value: 2 },
    ]));
  it('valeurs invalides ramenées à 0, commandes normalisées', () => {
    expect(stats.totalRevenue).toBe(0);
    expect(stats.recentOrders[0].status).toBe('en_attente');
  });
});
