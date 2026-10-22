import * as z from 'zod/mini';
import {
  emailField,
  optionalPhone,
  requiredText,
  strongPassword,
  withPasswordConfirm,
} from '@/lib/validation';

export const ROLES = [
  { value: 'user', label: 'Client' },
  { value: 'admin', label: 'Administrateur' },
];

export const createUserSchema = withPasswordConfirm(
  z.object({
    name: requiredText('Le nom', 100),
    email: emailField,
    phone: optionalPhone,
    role: z.enum(['user', 'admin']),
    password: strongPassword,
    confirmPassword: z.string(),
  })
);

export const EMPTY_USER = {
  name: '',
  email: '',
  phone: '',
  role: 'user',
  password: '',
  confirmPassword: '',
};
