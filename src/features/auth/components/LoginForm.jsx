import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@/components/common/Alert';
import { PasswordField } from '@/components/common/form/PasswordField';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { TextField } from '@/components/common/form/TextField';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema } from '@/features/auth/schemas';
import { useZodForm } from '@/hooks/useZodForm';
import { safeRedirect } from '@/lib/safeRedirect';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const redirectTo = safeRedirect(
    location.state?.from?.pathname || new URLSearchParams(location.search).get('redirect')
  );
  const form = useZodForm(loginSchema, { email: location.state?.email || '', password: '' });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    setError('');
    const result = await login(email, password);
    if (result.success) navigate(redirectTo, { replace: true });
    else setError(result.message);
  });

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <Alert variant="success">{location.state?.message}</Alert>
      <Alert variant="error">{error}</Alert>

      <TextField
        {...form.field('email')}
        label="Adresse email"
        type="email"
        icon={Mail}
        autoComplete="email"
        placeholder="exemple@domaine.com"
      />
      <PasswordField
        {...form.field('password')}
        label="Mot de passe"
        autoComplete="current-password"
        placeholder="********"
        action={
          <Link to="/forgot-password" className="link-primary">
            Mot de passe oublié ?
          </Link>
        }
      />

      <SubmitButton loading={form.submitting} loadingText="Connexion en cours...">
        Se connecter
        <ArrowRight aria-hidden="true" />
      </SubmitButton>

      <div className="auth-note">
        <p className="auth-note__title">
          <ShieldCheck aria-hidden="true" /> Connexion sécurisée
        </p>
        <p>Vos données sont chiffrées et ne sont jamais partagées sans votre consentement.</p>
      </div>
    </form>
  );
}
