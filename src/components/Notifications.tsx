"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles/Notifications.module.css'; // Create a CSS file for the notification styles
import { useCart } from '../app/context/CartContext';

interface NotificationProps {
  duration?: number; // Optional prop to set the duration of the notification
}

const Notification: React.FC<NotificationProps> = ({ duration = 3000 }) => {
  const { message } = useCart(); // Access the message from CartContext
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (message) {
      setShowNotification(true); // Show the notification when there is a message
      
      // Automatically hide notification after the specified duration
      const timer = setTimeout(() => {
        setShowNotification(false); // Hide the notification after duration
      }, duration);

      return () => {
        clearTimeout(timer); // Clean up the timer if the component is unmounted or if message changes
      };
    } else {
      setShowNotification(false); // Hide notification if there is no message
    }
  }, [message, duration]);

  // This callback helps clean up and handle the notification disappearance after the transition ends
  const handleTransitionEnd = () => {
    if (!showNotification) {
      // Optionally, you can perform any additional cleanup here
    }
  };

  if (!showNotification) return null; // Don't render anything if not showing

  return (
    <div
      className={`${styles.notification} ${showNotification ? styles.show : ''}`}
      role="alert" // ARIA role for accessibility
      aria-live="assertive" // Announce changes to assistive technologies
      onTransitionEnd={handleTransitionEnd} // Ensures transition completes before cleanup
    >
      <p>{message}</p>
    </div>
  );
};

export default Notification;