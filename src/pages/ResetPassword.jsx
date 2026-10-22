import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthCard } from '@/features/auth/components/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export default function ResetPassword() {
  const { token: tokenInUrl } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = tokenInUrl || state?.token;

  // Le lien reçu par email contient un secret : on le retire aussitôt de la barre d'adresse
  // (historique, captures d'écran, partage du lien) en le gardant seulement en mémoire
  useEffect(() => {
    if (tokenInUrl) navigate('/reset-password', { replace: true, state: { token: tokenInUrl } });
  }, [tokenInUrl, navigate]);

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
