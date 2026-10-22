import { useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from '@/app/routes';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastProvider } from '@/components/common/toast/ToastProvider';
import { IdleLogout } from '@/features/auth/components/IdleLogout';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { CartProvider } from '@/features/cart/context/CartProvider';
import { NotificationProvider } from '@/features/notifications/context/NotificationProvider';
import { safeRedirect } from '@/lib/safeRedirect';

// Redirige vers la connexion quand une action exige d'être connecté (ex : ajout au panier)
function AuthRedirectListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const onAuthRequired = (event) => {
      const returnUrl = safeRedirect(event.detail?.returnUrl);
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
    };
    window.addEventListener('auth-required', onAuthRequired);
    return () => window.removeEventListener('auth-required', onAuthRequired);
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <CartProvider>
                <AuthRedirectListener />
                <IdleLogout />
                <AppRoutes />
              </CartProvider>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
