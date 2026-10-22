import { Mail, Phone, Shield, User, UserPlus } from 'lucide-react';
import { PasswordField } from '@/components/common/form/PasswordField';
import { SelectField } from '@/components/common/form/SelectField';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { TextField } from '@/components/common/form/TextField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createUserSchema, EMPTY_USER, ROLES } from '@/features/admin/users/schemas';
import { useZodForm } from '@/hooks/useZodForm';

export function CreateUserDialog({ open, onClose, onCreate }) {
  const form = useZodForm(createUserSchema, EMPTY_USER);

  const close = () => {
    form.setValues(EMPTY_USER);
    form.setErrors({});
    onClose();
  };

  const onSubmit = form.handleSubmit(async ({ confirmPassword: _confirm, ...user }) => {
    if (await onCreate(user)) close();
  });

  return (
    <Dialog open={open} onOpenChange={(value) => !value && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>Le compte sera créé immédiatement.</DialogDescription>
        </DialogHeader>
        <form className="dialog-form" onSubmit={onSubmit} noValidate>
          <TextField
            {...form.field('name')}
            label="Nom complet *"
            icon={User}
            placeholder="Ex : Jean Kouassi"
          />
          <TextField
            {...form.field('email')}
            label="Email *"
            type="email"
            icon={Mail}
            autoComplete="off"
          />
          <div className="form-grid">
            <PasswordField
              {...form.field('password')}
              label="Mot de passe *"
              autoComplete="new-password"
            />
            <PasswordField
              {...form.field('confirmPassword')}
              label="Confirmer *"
              autoComplete="new-password"
            />
          </div>
          <div className="form-grid">
            <SelectField {...form.field('role')} label="Rôle *" icon={Shield} options={ROLES} />
            <TextField {...form.field('phone')} label="Téléphone" type="tel" icon={Phone} />
          </div>
          <SubmitButton loading={form.submitting} loadingText="Création...">
            <UserPlus aria-hidden="true" /> Créer l'utilisateur
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
