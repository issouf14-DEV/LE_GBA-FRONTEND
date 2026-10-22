import * as z from 'zod/mini';
import { emailField, freeText, optionalPhone, refine, requiredText } from '@/lib/validation';

export const contactSchema = z.object({
  name: requiredText('Le nom', 100),
  email: emailField,
  phone: optionalPhone,
  subject: requiredText('Le sujet', 150),
  message: freeText(
    2000,
    refine((v) => v.length >= 10, 'Au moins 10 caractères')
  ),
});

export const EMPTY_CONTACT = { name: '', email: '', phone: '', subject: '', message: '' };
