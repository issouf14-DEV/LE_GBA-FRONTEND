import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

const ASIDE = {
  badge: 'Sécurité optimale',
  badgeIcon: ShieldCheck,
  title: 'Rejoignez la communauté GBA et accédez à vos véhicules premium en quelques clics.',
  text: "Consultez vos commandes, sauvegardez vos modèles favoris et profitez d'un suivi personnalisé.",
  footer: 'Assistance 24/7 • Transactions sécurisées • Historique complet',
};

export default function Login() {
  return (
    <AuthLayout
      variant="login"
      aside={ASIDE}
      title="Connexion à votre compte"
      subtitle={
        <>
          Nouveau chez nous ?{' '}
          <Link to="/register" className="link-primary">
            Créez un compte en 1 minute
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
