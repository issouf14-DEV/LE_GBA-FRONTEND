import { useCallback } from 'react';
import { useToast } from '@/components/common/toast/useToast';
import { useCart } from '@/features/cart/hooks/useCart';

// Ajout au panier avec confirmation visuelle (remplace les alert())
export function useAddToCart() {
  const { addToCart } = useCart();
  const toast = useToast();

  return useCallback(
    (vehicle, options) => {
      if (vehicle.available === false) {
        toast.warning("Ce véhicule n'est pas disponible pour le moment");
        return false;
      }
      const added = addToCart(vehicle, options);
      if (added) toast.success(`${vehicle.name || vehicle.model} ajouté au panier`);
      return added;
    },
    [addToCart, toast]
  );
}
