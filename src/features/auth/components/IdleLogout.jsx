import { useEffect } from 'react';
import { useToast } from '@/components/common/toast/useToast';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'];

// Ferme la session après 30 minutes sans activité (ordinateur partagé, onglet oublié)
export function IdleLogout() {
  const { isAuthenticated, logout } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let timer;

    const expire = () => {
      logout();
      toast.info("Session fermée après 30 minutes d'inactivité");
    };
    const restart = () => {
      clearTimeout(timer);
      timer = setTimeout(expire, IDLE_TIMEOUT_MS);
    };

    restart();
    for (const name of ACTIVITY_EVENTS) window.addEventListener(name, restart, { passive: true });
    return () => {
      clearTimeout(timer);
      for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, restart);
    };
  }, [isAuthenticated, logout, toast]);

  return null;
}
