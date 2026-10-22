import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Page réservée aux utilisateurs connectés (et aux admins si adminOnly).
// La session et le rôle viennent uniquement du serveur (cookies httpOnly).
export function ProtectedRoute({ adminOnly = false, children }) {
  const { isAuthenticated, isAdmin, sessionStatus } = useAuth();
  const location = useLocation();

  if (sessionStatus === 'checking')
    return <LoadingScreen fullScreen label="Vérification de la session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

// Login / inscription : inutile si on est déjà connecté
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, sessionStatus } = useAuth();
  if (sessionStatus === 'checking') return <LoadingScreen fullScreen />;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}
