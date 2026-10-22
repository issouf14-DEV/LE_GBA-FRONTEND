import { Camera, LogOut, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/common/toast/useToast';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { IMAGE_RULES } from '@/lib/constants';
import { readImageFile } from '@/lib/image';
import { getDisplayName } from '@/lib/user';

// Carte de gauche : photo (stockée sur cet appareil), nom, liens rapides, déconnexion
export function ProfileCard() {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const changePhoto = async (event) => {
    setBusy(true);
    try {
      updateUser({ profileImage: await readImageFile(event.target.files?.[0]) });
      toast.success('Photo de profil mise à jour');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };

  return (
    <aside className="profile-card">
      <div className="profile-card__avatar">
        <UserAvatar user={user} className="profile-card__avatar-img" />
        <label htmlFor="profile-photo" className="profile-card__photo-btn">
          <Camera aria-hidden="true" />
          <span className="sr-only">Changer la photo</span>
        </label>
        <input
          id="profile-photo"
          type="file"
          accept={IMAGE_RULES.types.join(',')}
          onChange={changePhoto}
          disabled={busy}
          className="sr-only"
        />
      </div>
      <h2 className="profile-card__name">{getDisplayName(user)}</h2>
      <p className="profile-card__email">{user?.email}</p>

      <div className="profile-card__links">
        {user?.profileImage && (
          <Button variant="ghost" onClick={() => updateUser({ profileImage: null })}>
            <Trash2 aria-hidden="true" /> Retirer la photo
          </Button>
        )}
        <Button asChild variant="ghost">
          <Link to="/profile/orders">
            <ShoppingBag aria-hidden="true" /> Mes commandes
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="text-danger"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut aria-hidden="true" /> Déconnexion
        </Button>
      </div>
    </aside>
  );
}
