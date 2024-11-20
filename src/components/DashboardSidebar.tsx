"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TfiAlignJustify } from "react-icons/tfi";
import styles from '../styles/DashboardSidebar.module.css';
import Link from 'next/link';
import { useCart } from '../app/context/CartContext';
import UserAvatarDropdown from '../components/loggs';
import Image from 'next/image';
import Cart from './Cart';
import ContactUsForm from './ContactUsForm';

const DashboardSidebar: React.FC = () => {
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false); // State for Contact Us form
  const sidebarRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const [isCartHovered, setIsCartHovered] = useState(false);

  // Toggle functions
  const handleCartMouseEnter = () => setIsCartHovered(true);
  const handleCartMouseLeave = () => setIsCartHovered(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);
  const toggleCart = () => setCartOpen(prev => !prev);
  const toggleContactForm = () => setContactFormOpen(prev => !prev); // Toggle Contact Us form

  // Handle clicks outside
  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
    if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
      setCartOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen || cartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, cartOpen]);

  return (
    <>
      <button onClick={toggleSidebar} className={styles.toggleButton} aria-label={isOpen ? 'Hide menu' : 'Show menu'}>
        <TfiAlignJustify size={24} />
      </button>

      {isOpen && (
        <>
          <div className={styles.sidebarOverlay} onClick={() => setIsOpen(false)} />

          <div ref={sidebarRef} className={styles.sidebarOpen}>
            <nav className={styles.menu}>
              <div className={styles.userAvatarContainer}>
                <UserAvatarDropdown />
              </div>
              <h2 className={styles.menuTitle}>Navigation</h2>
              <Link href="/" className={styles.menuItem}>Home</Link>
              <Link href="/dashboard" className={styles.menuItem}>Dashboard</Link>
              <Link href="/products" className={styles.menuItem}>Products</Link>
              <Link href="/about-us" className={styles.menuItem}>About Us</Link>


              <div className={styles.cartIconContainer} ref={cartRef}>
                <div className={styles.menuItem}>
                  <div
                    className={styles.cartIcon}
                    onClick={toggleCart}
                    onMouseEnter={handleCartMouseEnter}
                    onMouseLeave={handleCartMouseLeave}
                  >
                    <Image src="/images/cart.svg" alt="Cart Icon" width={32} height={32} />
                    <span>  Cart</span>
                    {isCartHovered && <span className={styles.cartItemCount}>{cartItems.length || '0'}</span>}
                  </div>
                </div>
                {cartOpen && (
                  <div className={`${styles.cartDropdown} ${cartOpen ? styles.cartOpen : ''}`}>
                    <Cart />
                  </div>
                )}
              </div>

              {/* Contact Us Button */}
              <div className={styles.contactUsContainer}>
                <button onClick={toggleContactForm} className={styles.contactus}>
                  <Image src="/images/mail_icon.svg" alt="Mail Icon" width={20} height={20} />
                  <span>  Contact</span>
                </button>
              </div>
            
            </nav>
          </div>
        </>
      )}

      {/* Contact Us Form Modal */}
      {contactFormOpen && (
        <div className={styles.modalOverlay} onClick={toggleContactForm}>
          <div onClick={(e) => e.stopPropagation()}>
            <ContactUsForm onClose={toggleContactForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
