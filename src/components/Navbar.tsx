import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import { useCart } from '../app/context/CartContext';
import Cart from './Cart';
import UserAvatarDropdown from '../components/loggs';
import ContactUsForm from './ContactUsForm';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../app/context/AuthContext';

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const { cartItems, message } = useCart();  // Get the message from context
  const cartRef = useRef<HTMLDivElement>(null);

  const toggleCart = () => {
    // Close the cart if it's empty
    if (cartItems.length === 0) {
      setCartOpen(false); // Close the cart dropdown
    } else {
      setCartOpen(!cartOpen); // Toggle the cart visibility
    }
  };

  const toggleContactForm = () => setContactFormOpen(!contactFormOpen);

  // Close cart when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
      setCartOpen(false); // Close the cart if clicked outside
    }
  };

  useEffect(() => {
    // Fetch user details when logged in
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${apiUrl}/api/user/details`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Failed to fetch user details: ${res.statusText}`);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    if (isLoggedIn) fetchUserDetails();

    // Attach event listener to handle click outside cart
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoggedIn]);

  return (
    <>
      <nav className={styles.navbar}>
        <DashboardSidebar />

        {/* Logo Section */}
        <div className={styles.logo}>
          <Image src="/images/your-logo.png" alt="Logo" width={50} height={50} />
          <p>Psy Tests</p>
        </div>

        {/* Menu Links */}
        <div className={styles.menu}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/about_us">About</Link>

          {/* Contact Us */}
          <a onClick={(e) => { e.stopPropagation(); toggleContactForm(); }} className={styles.contactLink}>
            <div className={styles.iconWithText}>
              <Image src="/images/mail_icon.svg" alt="Mail Icon" width={20} height={20} />
              <span className={styles.mail_text}>Contact Us</span>
            </div>
          </a>

          {/* User Avatar Dropdown */}
          <UserAvatarDropdown />
          {/* Cart Icon and Dropdown */}
          <div className={styles.cartIconContainer}>
            <div className={styles.cartIcon} onClick={toggleCart}>
              <Image src="/images/cart.svg" alt="Cart Icon" width={32} height={32} />
              <span className={styles.cartItemCount}>{cartItems.length || '0'}</span>
            </div>
            {cartOpen && (
              <div
                ref={cartRef}
                className={`${styles.cartDropdown} ${cartOpen ? styles.cartOpen : ''}`}
              >
                {cartItems.length === 0 ? (
                  <div className={styles.emptyCartMessage}>{message}</div> // Display the message if cart is empty
                ) : (
                  <Cart />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals and Forms */}
        {contactFormOpen && (
          <div className={styles.modalOverlay} onClick={toggleContactForm}>
            <div onClick={(e) => e.stopPropagation()}>
              <ContactUsForm onClose={() => setContactFormOpen(false)} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
