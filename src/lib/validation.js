// Briques Zod réutilisées par tous les formulaires (zod/mini : même moteur, bundle bien plus léger)
import * as z from 'zod/mini';
import { safeImageUrl } from '@/lib/safeUrl';

// Les champs « nom / titre » n'ont aucune raison de contenir du balisage HTML
const NO_MARKUP = /^[^<>]*$/;
const noMarkupMessage = 'Les caractères < et > ne sont pas autorisés';

// Raccourcis lisibles pour les vérifications les plus fréquentes
export const trimmed = (...checks) => z.string().check(z.trim(), ...checks);
export const refine = (fn, message) => z.refine(fn, { message });

export const requiredText = (label, max = 100, ...checks) =>
  trimmed(
    z.minLength(1, `${label} est obligatoire`),
    z.maxLength(max, `${label} : ${max} caractères maximum`),
    z.regex(NO_MARKUP, noMarkupMessage),
    ...checks
  );

export const optionalText = (max = 200) =>
  trimmed(z.maxLength(max, `${max} caractères maximum`), z.regex(NO_MARKUP, noMarkupMessage));

// Texte libre (message, notes) : le balisage est permis mais toujours affiché comme du texte
export const freeText = (max, ...checks) =>
  trimmed(z.maxLength(max, `${max} caractères maximum`), ...checks);

export const emailField = trimmed(
  z.toLowerCase(),
  z.maxLength(254, 'Adresse email trop longue'),
  z.regex(z.regexes.email, 'Adresse email invalide')
);

export const phoneField = trimmed(
  z.regex(/^\+?[0-9\s.-]{8,20}$/, 'Numéro de téléphone invalide (ex : 07 12 34 56 78)'),
  refine((value) => value.replace(/\D/g, '').length >= 8, 'Au moins 8 chiffres')
);

export const optionalPhone = z.union([z.literal(''), phoneField]);

export const strongPassword = z
  .string()
  .check(
    z.minLength(8, 'Au moins 8 caractères'),
    z.maxLength(128, '128 caractères maximum'),
    z.regex(/[A-Za-z]/, 'Au moins une lettre'),
    z.regex(/[0-9]/, 'Au moins un chiffre')
  );

// Mot de passe saisi à la connexion : borné pour éviter d'envoyer des données géantes au serveur
export const loginPassword = z
  .string()
  .check(
    z.minLength(1, 'Le mot de passe est obligatoire'),
    z.maxLength(128, '128 caractères maximum')
  );

// Date du calendrier au format AAAA-MM-JJ, réellement existante
export const isoDate = (message) =>
  z.string().check(
    z.regex(/^\d{4}-\d{2}-\d{2}$/, message),
    refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
    }, message)
  );

// Vérification au niveau de l'objet, rattachée à un champ précis
export const crossCheck = (fn, message, field) => z.refine(fn, { message, path: [field] });

// Ajoute la vérification « confirmation identique » à un schéma objet
export const withPasswordConfirm = (schema, field = 'password') =>
  schema.check(
    crossCheck(
      (data) => data[field] === data.confirmPassword,
      'Les mots de passe ne correspondent pas',
      'confirmPassword'
    )
  );

// Entier (converti depuis un champ texte) compris entre min et max
export const intField = (min, max, message = 'Valeur invalide') =>
  z.coerce
    .number({ message })
    .check(refine(Number.isInteger, message), z.minimum(min, message), z.maximum(max, message));

// Valeur relue du stockage : remplacée par `fallback` si elle est invalide
export const lenient = (schema, fallback) => z.catch(schema, fallback);
// Image relue du stockage : seules les URL sûres sont conservées, sinon null
export const safeImage = z.pipe(
  lenient(z.nullable(z.string()), null),
  z.transform((value) => safeImageUrl(value))
);

export const safeText = (max) => lenient(z.string().check(z.maxLength(max)), '');
