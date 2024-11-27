import React, { createContext, useContext, useState, useRef } from "react";

// Define the structure of a cart item
interface CartItem {
  image: string;
  _id: string;
  name: string;
  price: number;
}

// Define the structure of the context value
interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  message: string; // Message when cart actions occur
  cartIconMessage: string; // Message for cart icon click
  showCartIconMessage: (message: string) => void; // Function to show the cart icon message
  emptyCart: () => void; // Message for when the cart is empty
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");
  const [cartIconMessage, setCartIconMessage] = useState("");
  const messageTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateMessage = (msg: string) => {
    if (messageTimeout.current) {
      clearTimeout(messageTimeout.current);
    }
    setMessage(msg);
    messageTimeout.current = setTimeout(() => setMessage(""), 2000);
  };

  const showCartIconMessage = (msg: string) => {
    setCartIconMessage(msg);
    setTimeout(() => setCartIconMessage(""), 2000); // Hide message after 2 seconds
  };

  const addToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.some((item) => item._id === newItem._id);

      if (isItemInCart) {
        updateMessage("Item already in your cart.");
        return prevItems;
      }

      updateMessage("Item added successfully.");
      return [...prevItems, { ...newItem }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    updateMessage("Item removed from the cart.");
  };

  const clearCart = () => {
    setCartItems([]); // This will clear the cart
    updateMessage("Cart cleared.");
  };

  // Function to show message if cart is empty
  const emptyCart = () => {
    if (cartItems.length === 0) {
      updateMessage("Your cart is empty."); // Show the empty cart message
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        message,
        cartIconMessage,
        showCartIconMessage,
        emptyCart, // Provide emptyCart function to consumers
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
