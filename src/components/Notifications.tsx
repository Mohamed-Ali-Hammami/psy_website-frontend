"use client";
// components/Notification.tsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Notifications.module.css'; // Create a CSS file for the notification styles
import { useCart } from '../app/context/CartContext';

const Notification: React.FC = () => {
  const { message } = useCart(); // Access the message from CartContext
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (message) {
      setShowNotification(true);
      // Automatically hide notification after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [message]);

  if (!showNotification) return null; // Don't render anything if not showing

  return (
    <div className={styles.notification}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
