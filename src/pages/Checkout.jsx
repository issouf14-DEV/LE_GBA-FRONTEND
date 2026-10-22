import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';

export default function Checkout() {
  return (
    <div className="page page--offset" translate="no">
      <div className="page-container">
        <header className="section-header">
          <h1 className="section-title">Finaliser votre réservation</h1>
          <p className="section-subtitle">Plus que quelques étapes pour prendre la route</p>
        </header>
        <CheckoutForm />
      </div>
    </div>
  );
}
