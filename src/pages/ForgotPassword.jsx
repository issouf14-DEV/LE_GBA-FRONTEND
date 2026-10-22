import { AuthCard } from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <AuthCard>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
