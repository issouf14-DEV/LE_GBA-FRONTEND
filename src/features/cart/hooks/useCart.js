import { useContext } from 'react';
import { CartContext } from '@/features/cart/context/cartContext';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart doit être utilisé dans un CartProvider');
  return context;
}
