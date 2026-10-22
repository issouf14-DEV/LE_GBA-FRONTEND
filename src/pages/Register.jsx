import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

const ASIDE = {
  badge: 'LE-GBA',
  badgeIcon: Car,
  title:
    'Inscrivez-vous et bénéficiez d’un accompagnement sur mesure pour trouver votre prochaine voiture.',
  points: [
    'Historique de vos recherches et véhicules favoris toujours accessibles.',
    'Offres exclusives et conseils personnalisés en priorité.',
    'Suivi de vos commandes en temps réel, du devis à la livraison.',
  ],
  footer: 'Service client 7j/7 • Données chiffrées • Confiance des plus grandes marques',
};

export default function Register() {
  return (
    <AuthLayout
      variant="register"
      aside={ASIDE}
      title="Créer votre compte"
      subtitle={
        <>
          Vous avez déjà un accès ?{' '}
          <Link to="/login" className="link-primary">
            Connectez-vous ici
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
