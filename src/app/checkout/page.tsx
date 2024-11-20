// app/checkout/page.tsx
'use client';  // Enable client-side rendering for this page

import CheckoutPage from "@/components/CheckoutPage";  // Import the CheckoutPage component

const Checkout = () => {
  return (
    <div>
      <CheckoutPage />  {/* Render the CheckoutPage component */}
    </div>
  );
};

export default Checkout;
