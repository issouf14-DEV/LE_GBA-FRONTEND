// Niveau 8 : robustesse (stockage bloqué ou falsifié, confusion de prototype, inactivité)
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '@/components/common/toast/ToastProvider';
import { IDLE_TIMEOUT_MS, IdleLogout } from '@/features/auth/components/IdleLogout';
import { AuthContext } from '@/features/auth/context/authContext';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { parseNotifications } from '@/features/notifications/lib/notification';
import { normalizeStatus } from '@/features/orders/lib/orderStatus';
import { ownValue } from '@/lib/object';
import { storage } from '@/lib/storage';
import { authValue } from '../helpers/render';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

describe('Confusion de prototype', () => {
  it.each(['constructor', '__proto__', 'toString', 'hasOwnProperty'])('clé « %s »', (key) => {
    expect(ownValue({ a: 1 }, key, 'défaut')).toBe('défaut');
    expect(normalizeStatus(key)).toBe('en_attente');
  });

  it('une notification de type « constructor » s’affiche sans planter', () => {
    const notification = { id: 'n1', type: 'constructor', title: 'T', message: 'M', read: false };
    expect(() =>
      render(<NotificationItem notification={notification} onRead={() => {}} onDelete={() => {}} />)
    ).not.toThrow();
  });
});

describe('Notifications relues depuis le navigateur', () => {
  it('les entrées invalides ou géantes sont écartées ou tronquées', () => {
    const list = parseNotifications([
      { id: 'n1', title: 'ok', message: 'ok', type: 'order', timestamp: '', read: false },
      { title: 'sans id' },
      { id: { $ne: null } },
      { id: 'n2', title: 'x'.repeat(10_000) },
      'texte',
    ]);
    expect(list.map((n) => n.id)).toEqual(['n1', 'n2']);
    expect(list[1].title).toBe('');
  });

  it('au plus 50 notifications sont rechargées', () => {
    const many = Array.from({ length: 500 }, (_, i) => ({ id: `n${i}`, title: 't' }));
    expect(parseNotifications(many)).toHaveLength(50);
  });

  it('une valeur non tableau donne une liste vide', () => {
    expect(parseNotifications({ id: 'n1' })).toEqual([]);
  });
});

describe('Stockage du navigateur indisponible (navigation privée, quota)', () => {
  it('aucune exception quand le stockage est bloqué', () => {
    const fail = () => {
      throw new Error('SecurityError');
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(fail);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(fail);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(fail);
    expect(storage.get('x')).toBeNull();
    expect(storage.getJSON('x', [])).toEqual([]);
    expect(() => storage.setJSON('x', { a: 1 })).not.toThrow();
    expect(() => storage.remove('x')).not.toThrow();
  });

  it('un JSON corrompu renvoie la valeur par défaut', () => {
    localStorage.setItem('x', '{corrompu');
    expect(storage.getJSON('x', 'défaut')).toBe('défaut');
  });
});

describe('Déconnexion après inactivité', () => {
  function renderIdle(logout) {
    return render(
      <ToastProvider>
        <AuthContext.Provider value={authValue({ logout })}>
          <IdleLogout />
        </AuthContext.Provider>
      </ToastProvider>
    );
  }

  it('déconnecte après 30 minutes sans activité', () => {
    vi.useFakeTimers();
    const logout = vi.fn();
    renderIdle(logout);
    act(() => vi.advanceTimersByTime(IDLE_TIMEOUT_MS + 1000));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('l’activité de l’utilisateur repousse la déconnexion', () => {
    vi.useFakeTimers();
    const logout = vi.fn();
    renderIdle(logout);
    act(() => vi.advanceTimersByTime(IDLE_TIMEOUT_MS - 1000));
    act(() => window.dispatchEvent(new Event('keydown')));
    act(() => vi.advanceTimersByTime(IDLE_TIMEOUT_MS - 1000));
    expect(logout).not.toHaveBeenCalled();
  });
});
