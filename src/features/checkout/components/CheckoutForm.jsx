import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '@/components/common/Alert';
import { EmptyState } from '@/components/common/EmptyState';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Button } from '@/components/ui/button';
import { CheckoutStepper } from '@/features/checkout/components/CheckoutStepper';
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary';
import { ContactStep } from '@/features/checkout/components/ContactStep';
import { DatesStep } from '@/features/checkout/components/DatesStep';
import { PaymentStep } from '@/features/checkout/components/PaymentStep';
import { useCheckout } from '@/features/checkout/hooks/useCheckout';

const STEPS = { 1: ContactStep, 2: DatesStep, 3: PaymentStep };

export function CheckoutForm() {
  const checkout = useCheckout();
  const { vehicle, form, step, lastStep } = checkout;
  const Step = STEPS[step];

  if (checkout.vehicleLoading) return <LoadingScreen label="Vérification du véhicule..." />;

  if (checkout.cartItem && !vehicle) {
    return (
      <EmptyState
        icon={AlertCircle}
        tone="error"
        title="Véhicule indisponible"
        description="Ce véhicule n'existe plus ou n'a pas pu être vérifié. Retirez-le du panier et réessayez."
      >
        <Button asChild className="btn-gradient btn-auto">
          <Link to="/cart">Retour au panier</Link>
        </Button>
      </EmptyState>
    );
  }

  if (!vehicle) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Panier vide"
        description="Découvrez nos véhicules disponibles."
      >
        <Button asChild className="btn-gradient btn-auto">
          <Link to="/vehicles">Voir les véhicules</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <CheckoutStepper current={step} />
      <div className="checkout-layout">
        <form className="checkout-main" onSubmit={checkout.submit} noValidate>
          <Alert variant="error">{checkout.error}</Alert>
          <div className="checkout-card">
            <div className="checkout-card__body">
              <Step form={form} />
            </div>
            <div className="checkout-card__footer">
              <Button type="button" variant="outline" onClick={checkout.back} disabled={step === 1}>
                <ArrowLeft aria-hidden="true" /> Retour
              </Button>
              {step < lastStep ? (
                <Button type="button" onClick={checkout.next}>
                  Suivant <ArrowRight aria-hidden="true" />
                </Button>
              ) : (
                <SubmitButton
                  loading={form.submitting}
                  loadingText="Traitement en cours..."
                  className="btn-auto"
                >
                  Confirmer la réservation <CheckCircle2 aria-hidden="true" />
                </SubmitButton>
              )}
            </div>
          </div>
        </form>
        <CheckoutSummary
          vehicle={vehicle}
          quote={checkout.quote}
          startDate={form.values.startDate}
          endDate={form.values.endDate}
        />
      </div>
    </>
  );
}
