import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CartContext } from '@/features/cart/context/cartContext';
import { loadCart, toCartItem } from '@/features/cart/lib/cartItem';
import { storage } from '@/lib/storage';

const cartKey = (user) => `cart_${user?.id || 'guest'}`;
const MAX_QUANTITY = 10;
const sameItem = (item, vehicleId, options) =>
  item.id === String(vehicleId) && JSON.stringify(item.options) === JSON.stringify(options);
const itemPrice = (item) =>
  (Number.parseFloat(item.price) || 0) +
  Object.values(item.options || {}).reduce(
    (sum, option) => sum + (Number.parseFloat(option?.price) || 0),
    0
  );

export function CartProvider({ children }) {
  const { user } = useAuth();
  const key = cartKey(user);
  const [cart, setCart] = useState(() => ({ key, items: loadCart(key) }));

  // Changement d'utilisateur : on charge son panier
  const cartItems = cart.key === key ? cart.items : loadCart(key);
  if (cart.key !== key) setCart({ key, items: cartItems });

  useEffect(() => {
    storage.setJSON(cart.key, cart.items);
  }, [cart]);

  const setItems = useCallback((update) => {
    setCart((current) => ({ ...current, items: update(current.items) }));
  }, []);

  const addToCart = useCallback(
    (vehicle, options = {}) => {
      if (!user) {
        window.dispatchEvent(
          new CustomEvent('auth-required', { detail: { returnUrl: window.location.pathname } })
        );
        return false;
      }
      const vehicleId = vehicle._id ?? vehicle.id;
      setItems((items) =>
        items.some((item) => sameItem(item, vehicleId, options))
          ? items.map((item) =>
              sameItem(item, vehicleId, options)
                ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
                : item
            )
          : [...items, toCartItem(vehicle, options)]
      );
      return true;
    },
    [user, setItems]
  );

  const removeFromCart = useCallback(
    (vehicleId, options) =>
      setItems((items) => items.filter((item) => !sameItem(item, vehicleId, options))),
    [setItems]
  );

  const updateQuantity = useCallback(
    (vehicleId, options, quantity) =>
      setItems((items) =>
        quantity <= 0
          ? items.filter((item) => !sameItem(item, vehicleId, options))
          : items.map((item) =>
              sameItem(item, vehicleId, options)
                ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
                : item
            )
      ),
    [setItems]
  );

  const clearCart = useCallback(() => setItems(() => []), [setItems]);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal: () => cartItems.reduce((sum, item) => sum + itemPrice(item) * item.quantity, 0),
      getCartCount: () => cartItems.reduce((count, item) => count + item.quantity, 0),
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
