import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Cart.module.css';
import { useCart } from '../app/context/CartContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [loading] = useState(false);

  const formatPrice = (price: number) => price.toFixed(2);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Encode cartItems into a query parameter
  const cartData = encodeURIComponent(JSON.stringify(cartItems));

  return (
    <div className={styles.cartContainer}>
        <>
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {cartItems.map(item => (
                <div key={item._id} className={styles.cartItem}>
                  <div className={styles.productImage}>
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className={styles.productDetails}>
                    <h2>{item.name}</h2>
                    <p className={styles.price}>${formatPrice(item.price)}</p>
                  </div>
                  <div className={styles.productActions}>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span>Total</span>
                <span>${formatPrice(calculateTotalPrice())}</span>
              </div>
              <Link
                className={styles.alink}
                href={`/checkout?cart=${cartData}`} // Passing cart data in the query string
                passHref
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Link>
              <button onClick={clearCart} className={styles.clearButton}>
                Clear Cart
              </button>
            </div>
          </div>
        </>
    </div>
  );
};

export default Cart;
