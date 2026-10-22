import { Ban, Bell, Check, CheckCircle2, Clock, ShoppingCart, X } from 'lucide-react';
import { timeAgo } from '@/lib/format';
import { ownValue } from '@/lib/object';
import { cn } from '@/lib/utils';

const ICONS = {
  order: ShoppingCart,
  order_validee: CheckCircle2,
  order_rejetee: Ban,
  order_annulee: Ban,
  order_en_attente: Clock,
};

export function NotificationItem({ notification, onRead, onDelete }) {
  const { id, type, title, message, timestamp, read } = notification;
  const Icon = ownValue(ICONS, type, Bell);

  return (
    <li className={cn('notif-item', !read && 'notif-item--unread')}>
      <span className="notif-item__icon">
        <Icon aria-hidden="true" />
      </span>
      <div className="notif-item__body">
        <div className="notif-item__head">
          <p className="notif-item__title">{title}</p>
          <button
            type="button"
            className="notif-item__delete"
            onClick={() => onDelete(id)}
            aria-label="Supprimer la notification"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <p className="notif-item__message">{message}</p>
        <div className="notif-item__foot">
          <span>{timeAgo(timestamp)}</span>
          {!read && (
            <button type="button" className="notif-item__read" onClick={() => onRead(id)}>
              <Check aria-hidden="true" /> Marquer lu
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
