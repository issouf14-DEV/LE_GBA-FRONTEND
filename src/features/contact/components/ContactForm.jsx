import { Mail, MessageSquare, Phone, Send, Tag, User } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '@/components/common/Alert';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { TextField } from '@/components/common/form/TextField';
import { contactSchema, EMPTY_CONTACT } from '@/features/contact/schemas';
import { useZodForm } from '@/hooks/useZodForm';
import { COMPANY } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';

// Ouvre Gmail avec le message pré-rempli (aucune donnée n'est envoyée à notre serveur)
function openGmail(values) {
  const body = [
    'NOUVEAU MESSAGE - FORMULAIRE CONTACT GBA',
    '',
    `Nom : ${values.name}`,
    `Email : ${values.email}`,
    `Téléphone : ${values.phone || 'Non renseigné'}`,
    '',
    `Sujet : ${values.subject}`,
    '',
    values.message,
    '',
    `Date : ${formatDateTime(new Date())}`,
  ].join('\n');
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: COMPANY.email,
    su: `Message GBA - ${values.subject}`,
    body,
  });
  window.open(`https://mail.google.com/mail/?${params}`, '_blank', 'noopener,noreferrer');
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const form = useZodForm(contactSchema, EMPTY_CONTACT);

  const onSubmit = form.handleSubmit((values) => {
    openGmail(values);
    form.setValues(EMPTY_CONTACT);
    setSent(true);
  });

  return (
    <div className="contact-card">
      <h2 className="contact-card__title">Envoyez-nous un message</h2>
      <Alert variant="success">
        {sent && 'Gmail s’est ouvert avec votre message : cliquez sur « Envoyer » pour finaliser.'}
      </Alert>
      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <TextField
            {...form.field('name')}
            label="Nom complet *"
            icon={User}
            autoComplete="name"
          />
          <TextField
            {...form.field('email')}
            label="Email *"
            type="email"
            icon={Mail}
            autoComplete="email"
          />
        </div>
        <div className="form-grid">
          <TextField
            {...form.field('phone')}
            label="Téléphone"
            type="tel"
            icon={Phone}
            autoComplete="tel"
          />
          <TextField {...form.field('subject')} label="Sujet *" icon={Tag} maxLength={150} />
        </div>
        <TextField
          {...form.field('message')}
          as="textarea"
          rows={5}
          maxLength={2000}
          label="Message *"
          icon={MessageSquare}
          placeholder="Décrivez votre demande en détail..."
        />
        <SubmitButton loading={form.submitting} loadingText="Ouverture...">
          <Send aria-hidden="true" /> Envoyer le message
        </SubmitButton>
      </form>
    </div>
  );
}
