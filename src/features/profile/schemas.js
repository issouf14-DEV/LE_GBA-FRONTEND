import * as z from 'zod/mini';
import {
  loginPassword,
  optionalPhone,
  optionalText,
  requiredText,
  strongPassword,
  withPasswordConfirm,
} from '@/lib/validation';

export const profileSchema = z.object({
  firstName: requiredText('Le prénom', 50),
  lastName: requiredText('Le nom', 50),
  phone: optionalPhone,
  address: optionalText(200),
});

export const passwordSchema = withPasswordConfirm(
  z.object({
    currentPassword: loginPassword,
    newPassword: strongPassword,
    confirmPassword: z.string(),
  }),
  'newPassword'
);
