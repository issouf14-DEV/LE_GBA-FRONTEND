import * as z from 'zod/mini';
import { daysBetween } from '@/lib/format';
import {
  crossCheck,
  emailField,
  freeText,
  isoDate,
  phoneField,
  refine,
  requiredText,
} from '@/lib/validation';

export const MAX_RENTAL_DAYS = 90;

export const today = () => new Date().toISOString().slice(0, 10);

const contactSchema = z.object({
  fullName: requiredText(
    'Le nom',
    100,
    refine((v) => v.length >= 3, 'Au moins 3 caractères')
  ),
  email: emailField,
  phone: phoneField,
  address: requiredText(
    "L'adresse",
    300,
    refine((v) => v.length >= 10, "L'adresse doit être complète (10 caractères minimum)")
  ),
});

const datesSchema = z
  .object({
    startDate: isoDate('Choisissez une date de début valide'),
    endDate: isoDate('Choisissez une date de fin valide'),
    notes: freeText(500),
  })
  .check(
    crossCheck(
      (data) => data.startDate >= today(),
      'La date de début ne peut pas être dans le passé',
      'startDate'
    ),
    crossCheck(
      (data) => data.endDate > data.startDate,
      'La date de fin doit être après la date de début',
      'endDate'
    ),
    crossCheck(
      (data) => daysBetween(data.startDate, data.endDate) <= MAX_RENTAL_DAYS,
      `Durée maximale : ${MAX_RENTAL_DAYS} jours`,
      'endDate'
    )
  );

const termsSchema = z.object({
  acceptTerms: z.literal(true, { message: 'Vous devez accepter les conditions générales' }),
});

export const STEP_SCHEMAS = { 1: contactSchema, 2: datesSchema, 3: termsSchema };
