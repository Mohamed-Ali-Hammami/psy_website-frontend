"use client"
import React, { createContext, useContext, useState } from 'react';

// Define the structure of a cart item
interface CartItem {
  image: string;
  _id: string;
  name: string;
  price: number;
}

// Define the structure of the context value
interface CartContextProps {
  cartItems: CartItem[]; // Array of items in the cart
  addToCart: (item: CartItem) => void; // Function to add an item to the cart
  removeFromCart: (id: string) => void; // Function to remove an item from the cart
  clearCart: () => void; // Function to clear all items in the cart
  message: string; // State to hold success/error message
}

// Create a context with an undefined initial value
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Create the CartProvider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // State to hold cart items
  const [message, setMessage] = useState(''); // State to hold the success/error message

  // Function to add an item to the cart
  const addToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.some(item => item._id === newItem._id);

      if (isItemInCart) {
        setMessage('Item already in your cart.');
        return prevItems; // Do not add a duplicate item
      }

      setMessage('Item added successfully.');
      return [...prevItems, { ...newItem }];
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    setMessage('Item removed from the cart.');
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
    setMessage('Cart cleared.');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, message }}>
      {children}
    </CartContext.Provider>
  );
};
