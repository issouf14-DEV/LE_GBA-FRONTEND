import { ArrowLeft, Mail, MailCheck, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '@/api/auth';
import { getErrorMessage } from '@/api/client';
import { Alert } from '@/components/common/Alert';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { TextField } from '@/components/common/form/TextField';
import { forgotPasswordSchema } from '@/features/auth/schemas';
import { useZodForm } from '@/hooks/useZodForm';

export function ForgotPasswordForm() {
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const form = useZodForm(forgotPasswordSchema, { email: '' });

  const onSubmit = form.handleSubmit(async ({ email }) => {
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setSentTo(email);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  if (sentTo) {
    return (
      <div className="auth-result">
        <span className="auth-result__icon auth-result__icon--success">
          <MailCheck aria-hidden="true" />
        </span>
        <h1 className="auth-title">Email envoyé</h1>
        <p className="auth-subtitle">
          Si un compte existe avec l'adresse <strong>{sentTo}</strong>, vous recevrez un lien de
          réinitialisation.
        </p>
        <Link to="/login" className="link-primary">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link to="/login" className="auth-back">
        <ArrowLeft aria-hidden="true" /> Retour à la connexion
      </Link>
      <h1 className="auth-title">Mot de passe oublié</h1>
      <p className="auth-subtitle">
        Entrez votre adresse email : nous vous enverrons un lien pour réinitialiser votre mot de
        passe.
      </p>
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Alert variant="error">{error}</Alert>
        <TextField
          {...form.field('email')}
          label="Adresse email"
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="exemple@domaine.com"
        />
        <SubmitButton loading={form.submitting} loadingText="Envoi en cours...">
          <Send aria-hidden="true" />
          Envoyer le lien
        </SubmitButton>
      </form>
    </>
  );
}
