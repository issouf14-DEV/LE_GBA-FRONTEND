import { useCallback, useEffect, useMemo, useState } from 'react';
import { authAPI } from '@/api/auth';
import { getErrorMessage } from '@/api/client';
import { AuthContext } from '@/features/auth/context/authContext';
import { buildUser, purgeLegacyStorage, saveLocalPhoto } from '@/features/auth/lib/session';
import { sessionStore } from '@/lib/storage';

// Synchronise la connexion / déconnexion entre les onglets ouverts
const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('auth');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // checking : vérification auprès du serveur | verified : connecté | idle : déconnecté
  const [status, setStatus] = useState('checking');

  const applyUser = useCallback((nextUser) => {
    saveLocalPhoto(nextUser);
    setUser(nextUser);
    setStatus('verified');
  }, []);

  const resetSession = useCallback(() => {
    sessionStore.remove('notifications');
    setUser(null);
    setStatus('idle');
  }, []);

  // Seul le serveur sait si les cookies de session sont valides
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await authAPI.getProfile();
      applyUser(buildUser(data?.user || data));
    } catch {
      resetSession();
    }
  }, [applyUser, resetSession]);

  useEffect(() => {
    purgeLegacyStorage();
    fetchUser();
    const onMessage = (event) => (event.data === 'logout' ? resetSession() : fetchUser());
    window.addEventListener('session-expired', resetSession);
    channel?.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('session-expired', resetSession);
      channel?.removeEventListener('message', onMessage);
    };
  }, [fetchUser, resetSession]);

  const authenticate = useCallback(
    async (request, extra, fallbackMessage) => {
      try {
        const { data } = await request();
        applyUser(buildUser(data?.user || data, extra));
        channel?.postMessage('login');
        return { success: true };
      } catch (error) {
        return { success: false, message: getErrorMessage(error, fallbackMessage) };
      }
    },
    [applyUser]
  );

  const login = useCallback(
    (email, password) =>
      authenticate(() => authAPI.login({ email, password }), {}, 'Email ou mot de passe incorrect'),
    [authenticate]
  );

  // La photo reste sur l'appareil : elle n'est pas envoyée au serveur
  const register = useCallback(
    ({ profileImage, ...payload }) =>
      authenticate(
        () => authAPI.register(payload),
        { ...payload, profileImage },
        "Erreur lors de l'inscription"
      ),
    [authenticate]
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // le serveur efface les cookies ; on ferme la session localement dans tous les cas
    } finally {
      resetSession();
      channel?.postMessage('logout');
    }
  }, [resetSession]);

  const updateUser = useCallback((changes) => {
    setUser((current) => {
      const merged = { ...current, ...changes };
      saveLocalPhoto(merged);
      return merged;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      fetchUser,
      updateUser,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      sessionStatus: status,
    }),
    [user, status, login, register, logout, fetchUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
