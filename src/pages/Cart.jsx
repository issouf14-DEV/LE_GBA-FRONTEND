import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHero } from '@/components/common/PageHero';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/features/cart/components/CartItem';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCart } from '@/features/cart/hooks/useCart';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  return (
    <div className="page page--muted">
      <PageHero title="Mon panier" icon={ShoppingCart} />
      <div className="page-container page-container--overlap">
        {cartItems.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Votre panier est vide"
            description="Découvrez nos véhicules et ajoutez-en à votre panier."
          >
            <Button asChild className="btn-gradient btn-auto">
              <Link to="/vehicles">Voir les véhicules</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              <h2 className="sr-only">Articles du panier</h2>
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.id}-${JSON.stringify(item.options)}`}
                  item={item}
                  onRemove={() => removeFromCart(item.id, item.options)}
                  onQuantity={(quantity) => updateQuantity(item.id, item.options, quantity)}
                />
              ))}
              <div className="cart-list__actions">
                <Button variant="ghost" className="text-danger" onClick={clearCart}>
                  Vider le panier
                </Button>
                <Link to="/vehicles" className="link-primary cart-list__continue">
                  <ArrowLeft aria-hidden="true" /> Continuer mes achats
                </Link>
              </div>
            </div>
            <CartSummary total={getCartTotal()} />
          </div>
        )}
      </div>
    </div>
  );
}
