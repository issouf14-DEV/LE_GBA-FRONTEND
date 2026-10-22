import * as z from 'zod/mini';
import {
  emailField,
  loginPassword,
  optionalPhone,
  optionalText,
  requiredText,
  strongPassword,
  withPasswordConfirm,
} from '@/lib/validation';

export const loginSchema = z.object({
  email: emailField,
  password: loginPassword,
});

export const registerSchema = withPasswordConfirm(
  z.object({
    firstName: requiredText('Le prénom', 50),
    lastName: requiredText('Le nom', 50),
    email: emailField,
    phone: optionalPhone,
    address: optionalText(200),
    password: strongPassword,
    confirmPassword: z.string(),
  })
);

export const forgotPasswordSchema = z.object({ email: emailField });

export const resetPasswordSchema = withPasswordConfirm(
  z.object({ password: strongPassword, confirmPassword: z.string() })
);
