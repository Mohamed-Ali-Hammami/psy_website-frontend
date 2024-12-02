import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Cart.module.css';
import { useCart } from '../app/context/CartContext';

interface CartProps {
  closeCart: () => void;
}

// Separate component for cart item
const CartItem: React.FC<{
  item: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  onRemove: (id: string) => void;
}> = ({ item, onRemove }) => (
  <div className={styles.cartItem}>
    <div className={styles.productImage}>
      <Image
        src={item.image || '/placeholder.jpg'}
        alt={item.name}
        width={80}
        height={80}
        placeholder="blur"
        blurDataURL="/placeholder.jpg"
      />
    </div>
    <div className={styles.productDetails}>
      <h2>{item.name}</h2>
      <p className={styles.price}>${item.price.toFixed(2)}</p>
    </div>
    <div className={styles.productActions}>
      <button
        onClick={() => onRemove(item._id)}
        className={styles.removeButton}
      >
        Remove
      </button>
    </div>
  </div>
);

// Cart Summary Component
const CartSummary: React.FC<{
  total: number;
  cartData: string;
  onClearCart: () => void;
  closeCart: () => void;
}> = ({ total, cartData, onClearCart, closeCart }) => (
  <div className={styles.orderSummary}>
    <h3>Order Summary</h3>
    <div className={styles.summaryRow}>
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
    <Link 
      href={`/checkout?cart=${cartData}`}
      className={styles.alink}
      onClick={closeCart} // Close cart on checkout click
    >
      Proceed to Checkout
    </Link>
    <button 
      onClick={onClearCart} 
      className={styles.clearButton}
    >
      Clear Cart
    </button>
  </div>
);

// Main Cart Component
const Cart: React.FC<CartProps> = ({ closeCart }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Memoized calculations to prevent unnecessary re-renders
  const totalPrice = useMemo(() => 
    cartItems.reduce((total, item) => total + item.price, 0),
    [cartItems]
  );

  const encodedCartData = useMemo(() => 
    encodeURIComponent(JSON.stringify(cartItems)),
    [cartItems]
  );

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cartItems.map(item => (
            <CartItem 
              key={item._id} 
              item={item} 
              onRemove={removeFromCart} 
            />
          ))}
        </div>
        <CartSummary 
          total={totalPrice}
          cartData={encodedCartData}
          onClearCart={clearCart}
          closeCart={closeCart} // Pass the closeCart function to CartSummary
        />
      </div>
    </div>
  );
};

export default Cart;
