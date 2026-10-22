import { Mail, MapPin, Phone, User } from 'lucide-react';
import { TextField } from '@/components/common/form/TextField';

export function ContactStep({ form }) {
  return (
    <div className="checkout-step">
      <h2 className="checkout-step__title">Vos coordonnées</h2>
      <TextField
        {...form.field('fullName')}
        label="Nom complet *"
        icon={User}
        autoComplete="name"
      />
      <div className="form-grid">
        <TextField
          {...form.field('email')}
          label="Email *"
          type="email"
          icon={Mail}
          autoComplete="email"
          hint="Vous recevrez la confirmation à cette adresse"
        />
        <TextField
          {...form.field('phone')}
          label="Téléphone *"
          type="tel"
          icon={Phone}
          autoComplete="tel"
          placeholder="07 12 34 56 78"
        />
      </div>
      <TextField
        {...form.field('address')}
        as="textarea"
        rows={3}
        label="Adresse *"
        icon={MapPin}
        autoComplete="street-address"
        placeholder="Cocody, Abidjan"
      />
    </div>
  );
}
