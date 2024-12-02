'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import TermsOfService from '../../components/Terms_of_services';
import SignUpForm from '../../components/RegisterForm';
import './checkoutcss.css';

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
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [showSignUpForm, setShowSignUpForm] = useState(false); 

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

  useEffect(() => {
    if (!isLoggedIn) {
      setShowDisclaimer(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000); // 3-second spinner
    return () => clearTimeout(timer);
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
    if (showSignUpForm) {
      return <SignUpForm onClose={() => setShowSignUpForm(false)} />;
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
    <div className='container'>
      {showDisclaimer && (
        <div className="disclaimer">
          {showSpinner ? (
            <div className="spinner"></div>
          ) : (
            <div className="disclaimerContent">
              <i className="attentionIcon">⚠️</i>
              <h2>Attention</h2>
              <p>
                - Each purchased product can only be downloaded <strong>once</strong>. If lost, you will not be able to re-download it.
                <br />
                - Please handle your downloads with care and follow the instructions provided.
                <br />
                - We highly recommend creating an account to access dashboard functionalities, including order management and re-downloading products.
              </p>
              <div className="buttonGroup">
                <button
                  className="closeDisclaimer"
                  onClick={() => {
                    setShowSignUpForm(true);
                    setShowDisclaimer(false);
                  }}
                >
                  Sign Up
                </button>
                <button
                  className="closeDisclaimer"
                  onClick={() => setShowDisclaimer(false)}
                >
                  I Understand
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sign-Up Form */}
      {showSignUpForm && (
        <div className="modal">
            <SignUpForm onClose={() => setShowSignUpForm(false)} />
        </div>
      )}

      <h1>Checkout</h1>
      {error && <p className='errorMessage'>{error}</p>}
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className='cartSummary'>
            <h2>Order Summary</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className='cartItem'>
                  <div className='cartItemDetails'>
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
            <div className='totalPrice'>
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          <div className='wthreeText'>
            <label className='anim'>
              <input
                className='checkbox'
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
                className='termsButton'
              >
                ← I Agree To The Terms & Conditions
              </span>
            </label>
          </div>

          {showModal && (
            <div className='modal'>
              <div className='modalContent'>
                <div className='modalHeader'>
                  <button
                    className='closeModalButton'
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
            className='checkoutButton'
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
