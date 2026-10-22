import { Mail, MapPin, Phone, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/common/Alert';
import { ImageUpload } from '@/components/common/form/ImageUpload';
import { PasswordField } from '@/components/common/form/PasswordField';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { TextField } from '@/components/common/form/TextField';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { registerSchema } from '@/features/auth/schemas';
import { useZodForm } from '@/hooks/useZodForm';

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
};

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const form = useZodForm(registerSchema, INITIAL);

  const onSubmit = form.handleSubmit(async ({ confirmPassword: _confirm, ...data }) => {
    setError('');
    const name = `${data.firstName} ${data.lastName}`;
    // La photo reste locale : le backend ne stocke pas les images
    const result = await register({ ...data, name, profileImage });
    if (!result.success) return setError(result.message);

    navigate('/', { replace: true });
  });

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <Alert variant="error">{error}</Alert>

      <div className="form-grid">
        <TextField
          {...form.field('firstName')}
          label="Prénom *"
          icon={User}
          autoComplete="given-name"
        />
        <TextField
          {...form.field('lastName')}
          label="Nom *"
          icon={User}
          autoComplete="family-name"
        />
      </div>

      <ImageUpload
        id="profileImage"
        label="Photo de profil (optionnel)"
        value={profileImage}
        onChange={setProfileImage}
      />

      <TextField
        {...form.field('email')}
        label="Email *"
        type="email"
        icon={Mail}
        autoComplete="email"
        placeholder="exemple@domaine.com"
      />

      <div className="form-grid">
        <TextField
          {...form.field('phone')}
          label="Téléphone"
          type="tel"
          icon={Phone}
          autoComplete="tel"
          placeholder="07 12 34 56 78"
        />
        <TextField
          {...form.field('address')}
          label="Adresse"
          icon={MapPin}
          autoComplete="street-address"
          placeholder="Ville, quartier..."
        />
      </div>

      <div className="form-grid">
        <PasswordField
          {...form.field('password')}
          label="Mot de passe *"
          autoComplete="new-password"
          hint="8 caractères min., avec lettres et chiffres"
        />
        <PasswordField
          {...form.field('confirmPassword')}
          label="Confirmer *"
          autoComplete="new-password"
        />
      </div>

      <SubmitButton loading={form.submitting} loadingText="Création du compte...">
        <UserPlus aria-hidden="true" />
        Créer mon compte
      </SubmitButton>
    </form>
  );
}
