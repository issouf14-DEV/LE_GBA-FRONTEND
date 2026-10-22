import { TriangleAlert } from 'lucide-react';
import { Component } from 'react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logger.error('Erreur non gérée', { error, info });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-screen">
        <div className="error-screen__card">
          <span className="error-screen__icon">
            <TriangleAlert aria-hidden="true" />
          </span>
          <h1 className="error-screen__title">Une erreur est survenue</h1>
          <p className="error-screen__text">
            Nous nous excusons pour ce désagrément. Rechargez la page pour continuer.
          </p>
          <div className="error-screen__actions">
            <Button className="btn-gradient" onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
            <Button variant="secondary" onClick={() => window.location.assign('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
