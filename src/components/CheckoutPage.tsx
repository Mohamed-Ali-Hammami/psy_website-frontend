'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import styles from '../styles/CSSCheckout.module.css';
import { useAuth } from '../app/context/AuthContext';
import TermsOfService from './Terms_of_services';

interface CartItem {
  _id: string;
  image: string;
  name: string;
  price: number;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<string>('0.00');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const queryCart = new URLSearchParams(window.location.search).get('cart');
    if (queryCart) {
      try {
        const items: CartItem[] = JSON.parse(queryCart);
        setCartItems(items);
        const total = items.reduce((acc, item) => acc + item.price, 0).toFixed(2);
        setTotalPrice(total);
      } catch (error) {
        console.error('Error parsing cart items:', error);
        setError('There was an issue loading your cart. Please try again.');
      }
    }
  }, []);

  const handleCheckout = async () => {
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions to proceed.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before proceeding to checkout.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            product_image: item.image,
            product_name: item.name,
            amount: item.price * 100,
            product_id: parseInt(item._id, 10),
          })),
          user_id: isLoggedIn ? user?.user_id : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session. Status: ${response.status}`);
      }

      const { id } = await response.json();
      const stripe = await stripePromise;

      if (stripe && id) {
        await stripe.redirectToCheckout({ sessionId: id });
      } else {
        throw new Error('Stripe initialization failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Failed to proceed with checkout. Redirecting to cart...');
      setTimeout(() => {
        router.push('/cart');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className={styles.cartItem}>
                  <div className={styles.cartItemDetails}>
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      width={80}
                      height={80}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.totalPrice}>
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          <div className={styles.wthreeText}>
            <label className={styles.anim}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
                className={styles.termsButton}
              >
                ← I Agree To The Terms & Conditions
              </span>
            </label>
          </div>

          {showModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <button
                    className={styles.closeModalButton}
                    onClick={() => setShowModal(false)}
                    aria-label="Close Terms and Conditions"
                  >
                    &times;
                  </button>
                  Privacy Policy
                </div>
                <TermsOfService />
              </div>
            </div>
          )}

          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
