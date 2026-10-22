import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '@/components/common/SafeImage';
import { formatPrice } from '@/lib/format';

export function CartItem({ item, onRemove, onQuantity }) {
  const options = Object.entries(item.options || {});

  return (
    <article className="cart-item">
      <SafeImage src={item.image} alt={item.name} className="cart-item__image" />
      <div className="cart-item__body">
        <div className="cart-item__head">
          <div>
            <h3 className="cart-item__title">
              <Link to={`/vehicles/${item.id}`}>{item.name}</Link>
            </h3>
            <p className="cart-item__brand">{item.brand}</p>
            {options.length > 0 && (
              <ul className="cart-item__options">
                {options.map(([category, option]) => (
                  <li key={category}>
                    {category} : {option.name}
                    {option.price > 0 && ` (+${formatPrice(option.price)})`}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="cart-item__remove"
            onClick={onRemove}
            aria-label="Retirer du panier"
          >
            <Trash2 aria-hidden="true" />
          </button>
        </div>

        <div className="cart-item__foot">
          <div className="quantity">
            <button
              type="button"
              onClick={() => onQuantity(item.quantity - 1)}
              aria-label="Diminuer la quantité"
            >
              <Minus aria-hidden="true" />
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantity(item.quantity + 1)}
              aria-label="Augmenter la quantité"
            >
              <Plus aria-hidden="true" />
            </button>
          </div>
          <p className="cart-item__price">
            {formatPrice(item.price)} <span>/ jour</span>
          </p>
        </div>
      </div>
    </article>
  );
}
