import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthCard } from '@/features/auth/components/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { readResetToken } from '@/features/auth/lib/resetToken';

export default function ResetPassword() {
  const { token: tokenInUrl } = useParams();
  const { hash, state } = useLocation();
  const navigate = useNavigate();
  // Jeton après le # (format actuel, jamais envoyé au serveur), ancien /:token ou state
  const token = readResetToken({ param: tokenInUrl, hash, state });
  const inAddressBar = Boolean(tokenInUrl || hash);

  // Le lien reçu par email contient un secret : on le retire aussitôt de la barre d'adresse
  // (historique, captures d'écran, partage du lien) en le gardant seulement en mémoire
  useEffect(() => {
    if (inAddressBar)
      navigate('/reset-password', { replace: true, state: token ? { token } : null });
  }, [inAddressBar, token, navigate]);

  return (
    <AuthCard>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="auth-result">
          <h1 className="auth-title">Lien invalide</h1>
          <p className="auth-subtitle">Ce lien de réinitialisation est incomplet ou a expiré.</p>
          <Link to="/forgot-password" className="link-primary">
            Demander un nouveau lien
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
