import { Alert } from '@/components/common/Alert';

// Paiement à la remise du véhicule : aucune donnée bancaire n'est saisie sur le site
export function PaymentStep({ form }) {
  const termsError = form.errors.acceptTerms;

  return (
    <div className="checkout-step">
      <h2 className="checkout-step__title">Confirmation</h2>

      <Alert variant="info" title="Paiement à la remise du véhicule">
        Votre réservation est d'abord validée par notre équipe. Le règlement se fait lors de la
        récupération du véhicule.
      </Alert>

      <label className="terms-box" htmlFor="acceptTerms">
        <input
          id="acceptTerms"
          name="acceptTerms"
          type="checkbox"
          checked={form.values.acceptTerms}
          onChange={form.handleChange}
          aria-invalid={Boolean(termsError)}
          className="terms-box__checkbox"
        />
        <span>
          <span className="terms-box__title">J'accepte les conditions générales de location *</span>
          <span className="terms-box__text">
            En cochant cette case, vous acceptez nos conditions de location.
          </span>
        </span>
      </label>
      {termsError && (
        <p className="field__error" role="alert">
          {termsError}
        </p>
      )}
    </div>
  );
}
