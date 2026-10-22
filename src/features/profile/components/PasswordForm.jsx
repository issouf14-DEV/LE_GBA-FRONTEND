import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { authAPI } from '@/api/auth';
import { getErrorMessage } from '@/api/client';
import { Alert } from '@/components/common/Alert';
import { PasswordField } from '@/components/common/form/PasswordField';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { useToast } from '@/components/common/toast/useToast';
import { passwordSchema } from '@/features/profile/schemas';
import { useZodForm } from '@/hooks/useZodForm';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function PasswordForm() {
  const toast = useToast();
  const [error, setError] = useState('');
  const form = useZodForm(passwordSchema, EMPTY);

  const onSubmit = form.handleSubmit(async ({ currentPassword, newPassword }) => {
    setError('');
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      form.setValues(EMPTY);
      toast.success('Mot de passe modifié');
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors du changement de mot de passe'));
    }
  });

  return (
    <form className="profile-form" onSubmit={onSubmit} noValidate>
      <div className="profile-form__header">
        <div>
          <h2 className="profile-form__title">Changer le mot de passe</h2>
          <p className="profile-form__subtitle">
            Sécurisez votre compte avec un nouveau mot de passe
          </p>
        </div>
      </div>

      <Alert variant="error">{error}</Alert>

      <PasswordField
        {...form.field('currentPassword')}
        label="Mot de passe actuel"
        autoComplete="current-password"
      />
      <PasswordField
        {...form.field('newPassword')}
        label="Nouveau mot de passe"
        autoComplete="new-password"
        hint="8 caractères min., avec lettres et chiffres"
      />
      <PasswordField
        {...form.field('confirmPassword')}
        label="Confirmer le mot de passe"
        autoComplete="new-password"
      />

      <SubmitButton loading={form.submitting} loadingText="Modification..." className="btn-auto">
        <KeyRound aria-hidden="true" /> Modifier le mot de passe
      </SubmitButton>
    </form>
  );
}
