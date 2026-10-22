import { Bell, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="header-icon-btn notif-bell"
        aria-label={unreadCount > 0 ? `Notifications : ${unreadCount} non lue(s)` : 'Notifications'}
      >
        <Bell aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="notif-bell__count" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="notif-panel">
        <div className="notif-panel__header">
          <p className="notif-panel__title">
            <Bell aria-hidden="true" /> Notifications
          </p>
          {unreadCount > 0 && (
            <button type="button" className="notif-panel__read-all" onClick={markAllAsRead}>
              <CheckCheck aria-hidden="true" /> Tout marquer lu
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="notif-panel__empty">
            <Bell aria-hidden="true" />
            <p>Aucune notification</p>
          </div>
        ) : (
          <ul className="notif-panel__list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
