import { useCallback, useEffect, useMemo, useState } from 'react';
import { NotificationContext } from '@/features/notifications/context/notificationContext';
import {
  createNotification,
  MAX_NOTIFICATIONS,
  parseNotifications,
} from '@/features/notifications/lib/notification';
import { sessionStore, storage } from '@/lib/storage';

const STORAGE_KEY = 'notifications';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    // Ancienne version : notifications conservées dans le localStorage -> supprimées
    storage.remove(STORAGE_KEY);
    return parseNotifications(sessionStore.getJSON(STORAGE_KEY, []));
  });

  useEffect(() => {
    sessionStore.setJSON(STORAGE_KEY, notifications);
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    const created = createNotification(notification);
    setNotifications((list) => [created, ...list].slice(0, MAX_NOTIFICATIONS));

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(created.title, { body: created.message, icon: '/favicon.ico' });
    }
    return created;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((list) => list.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    return (await Notification.requestPermission()) === 'granted';
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      requestPermission,
    }),
    [
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      requestPermission,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
