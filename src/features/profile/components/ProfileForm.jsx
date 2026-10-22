import { Mail, MapPin, Pencil, Phone, Save, User, X } from 'lucide-react';
import { useState } from 'react';
import { authAPI } from '@/api/auth';
import { getErrorMessage } from '@/api/client';
import { Alert } from '@/components/common/Alert';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { TextField } from '@/components/common/form/TextField';
import { useToast } from '@/components/common/toast/useToast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileSchema } from '@/features/profile/schemas';
import { useZodForm } from '@/hooks/useZodForm';

const valuesFrom = (user) => ({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  phone: user?.phone || '',
  address: user?.address || '',
});

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const form = useZodForm(profileSchema, valuesFrom(user));

  const cancel = () => {
    form.setValues(valuesFrom(user));
    form.setErrors({});
    setEditing(false);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');
    const changes = { ...values, name: `${values.firstName} ${values.lastName}` };
    try {
      await authAPI.updateProfile(changes);
      updateUser(changes);
      toast.success('Profil mis à jour');
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors de la mise à jour du profil'));
    }
  });

  return (
    <form className="profile-form" onSubmit={onSubmit} noValidate>
      <div className="profile-form__header">
        <div>
          <h2 className="profile-form__title">Informations personnelles</h2>
          <p className="profile-form__subtitle">Gérez vos informations de profil</p>
        </div>
        {!editing && (
          <Button type="button" variant="outline" onClick={() => setEditing(true)}>
            <Pencil aria-hidden="true" /> Modifier
          </Button>
        )}
      </div>

      <Alert variant="error">{error}</Alert>

      <fieldset className="profile-form__fields" disabled={!editing || form.submitting}>
        <div className="form-grid">
          <TextField
            {...form.field('firstName')}
            label="Prénom"
            icon={User}
            autoComplete="given-name"
          />
          <TextField
            {...form.field('lastName')}
            label="Nom"
            icon={User}
            autoComplete="family-name"
          />
        </div>
        <TextField
          id="email"
          label="Email"
          icon={Mail}
          value={user?.email || ''}
          readOnly
          disabled
          hint="L'email ne peut pas être modifié ici."
        />
        <TextField
          {...form.field('phone')}
          label="Téléphone"
          type="tel"
          icon={Phone}
          autoComplete="tel"
        />
        <TextField
          {...form.field('address')}
          label="Adresse"
          icon={MapPin}
          autoComplete="street-address"
        />
      </fieldset>

      {editing && (
        <div className="profile-form__actions">
          <Button type="button" variant="outline" onClick={cancel}>
            <X aria-hidden="true" /> Annuler
          </Button>
          <SubmitButton
            loading={form.submitting}
            loadingText="Enregistrement..."
            className="btn-auto"
          >
            <Save aria-hidden="true" /> Enregistrer
          </SubmitButton>
        </div>
      )}
    </form>
  );
}
