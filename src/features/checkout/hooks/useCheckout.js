import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod/mini';
import { getErrorMessage } from '@/api/client';
import { ordersAPI } from '@/api/orders';
import { useToast } from '@/components/common/toast/useToast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import { buildOrderPayload, computeQuote } from '@/features/checkout/lib/order';
import { STEP_SCHEMAS } from '@/features/checkout/schemas';
import { useVehicle } from '@/features/vehicles/hooks/useVehicle';
import { useZodForm } from '@/hooks/useZodForm';
import { getDisplayName } from '@/lib/user';

const LAST_STEP = 3;
// La validation est faite étape par étape (STEP_SCHEMAS), pas globalement
const NO_GLOBAL_SCHEMA = z.any();

export function useCheckout() {
  const { user } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const cartItem = cartItems[0] || null;
  // Prix et disponibilité relus sur le serveur : le panier (localStorage) est modifiable
  const { vehicle: fresh, loading: vehicleLoading } = useVehicle(cartItem?.id);
  const vehicle = cartItem && fresh ? { ...fresh, options: cartItem.options } : null;
  const form = useZodForm(NO_GLOBAL_SCHEMA, {
    fullName: getDisplayName(user),
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    startDate: '',
    endDate: '',
    notes: '',
    acceptTerms: false,
  });
  const quote = computeQuote(vehicle, form.values.startDate, form.values.endDate);

  const next = () =>
    form.validate(STEP_SCHEMAS[step]) && setStep((s) => Math.min(s + 1, LAST_STEP));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // handleSubmit gère l'état « envoi en cours » ; chaque étape est revalidée avant l'envoi
  const submit = form.handleSubmit(async () => {
    for (const [index, schema] of Object.entries(STEP_SCHEMAS)) {
      if (!schema.safeParse(form.values).success) {
        setStep(Number(index));
        form.validate(schema);
        return;
      }
    }
    setError('');
    if (!vehicle?.available) {
      setError("Ce véhicule n'est plus disponible.");
      return;
    }
    try {
      await ordersAPI.create(buildOrderPayload({ vehicle, values: form.values }));
      removeFromCart(cartItem.id, cartItem.options);
      toast.success('Réservation envoyée ! Un conseiller vous contactera rapidement.');
      navigate('/client/orders', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de traiter votre réservation'));
    }
  });

  return {
    user,
    cartItem,
    vehicleLoading,
    vehicle,
    form,
    quote,
    step,
    error,
    next,
    back,
    submit,
    lastStep: LAST_STEP,
  };
}
