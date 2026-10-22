import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { safeImageUrl } from '@/lib/safeUrl';
import { getDisplayName, getInitials } from '@/lib/user';
import { cn } from '@/lib/utils';

export function UserAvatar({ user, className }) {
  return (
    <Avatar className={cn('user-avatar', className)}>
      {safeImageUrl(user?.profileImage) && (
        <AvatarImage src={safeImageUrl(user.profileImage)} alt={getDisplayName(user)} />
      )}
      <AvatarFallback className="user-avatar__fallback">{getInitials(user)}</AvatarFallback>
    </Avatar>
  );
}
