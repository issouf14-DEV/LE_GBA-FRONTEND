import { useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import StateManager from './components/common/StateManager';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

// Composant qui écoute les demandes d'authentification (ex: ajout au panier sans être connecté)
const AuthRedirectListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRequired = (e) => {
      const returnUrl = e.detail?.returnUrl || '/';
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
    };

    window.addEventListener('auth-required', handleAuthRequired);
    return () => window.removeEventListener('auth-required', handleAuthRequired);
  }, [navigate]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <CartProvider>
                <AuthRedirectListener />
                <StateManager />
                <AppRoutes />
              </CartProvider>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;