import { CheckCircle2, KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth';
import { getErrorMessage } from '@/api/client';
import { Alert } from '@/components/common/Alert';
import { PasswordField } from '@/components/common/form/PasswordField';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { resetPasswordSchema } from '@/features/auth/schemas';
import { useZodForm } from '@/hooks/useZodForm';

const REDIRECT_DELAY = 3000;

export function ResetPasswordForm({ token }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const form = useZodForm(resetPasswordSchema, { password: '', confirmPassword: '' });

  useEffect(() => {
    if (!done) return undefined;
    const timer = setTimeout(
      () => navigate('/login', { state: { message: 'Mot de passe modifié. Connectez-vous.' } }),
      REDIRECT_DELAY
    );
    return () => clearTimeout(timer);
  }, [done, navigate]);

  const onSubmit = form.handleSubmit(async ({ password }) => {
    setError('');
    try {
      await authAPI.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Lien invalide ou expiré. Veuillez refaire une demande.'));
    }
  });

  if (done) {
    return (
      <div className="auth-result">
        <span className="auth-result__icon auth-result__icon--success">
          <CheckCircle2 aria-hidden="true" />
        </span>
        <h1 className="auth-title">Mot de passe modifié</h1>
        <p className="auth-subtitle">Redirection vers la connexion...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="auth-title">Nouveau mot de passe</h1>
      <p className="auth-subtitle">Choisissez un nouveau mot de passe pour votre compte.</p>
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Alert variant="error">{error}</Alert>
        <PasswordField
          {...form.field('password')}
          label="Nouveau mot de passe"
          autoComplete="new-password"
          hint="8 caractères min., avec lettres et chiffres"
        />
        <PasswordField
          {...form.field('confirmPassword')}
          label="Confirmer le mot de passe"
          autoComplete="new-password"
        />
        <SubmitButton loading={form.submitting} loadingText="Modification en cours...">
          <KeyRound aria-hidden="true" />
          Réinitialiser le mot de passe
        </SubmitButton>
      </form>
      <Link to="/login" className="auth-back auth-back--center">
        Retour à la connexion
      </Link>
    </>
  );
}
