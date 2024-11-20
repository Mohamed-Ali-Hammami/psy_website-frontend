'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { client } from '../../sanity/lib/client';
import ProductListing from '../../components/ProductListing';
import './success_css.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  pdfUrl?: string;
}

interface PurchaseStatus {
  [productName: string]: boolean;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false); // Flag to track if purchase is already processed
  const [isProductsLoading, setIsProductsLoading] = useState(true); // New loading state for products

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    const url_user_id = searchParams.get('user_id');

    // Check if session_id is not present or the session has already been processed
    if (!session_id || hasProcessed) {
      setIsLoading(false);
      return;
    }

    const recordPurchaseAndFetchProducts = async () => {
      setHasProcessed(true); // Mark the session as processed to prevent multiple calls

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        // Record Purchase
        const response = await fetch(`${apiUrl}/api/record-purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: session_id,
            user_id: user?.user_id || url_user_id || null,
          }),
        });

        const result = await response.json();
        const successfulPurchases = result.successful_purchases || [];

        // Merge new successful purchases with existing ones
        setPurchaseStatus((prevStatus) => {
          const updatedStatus = { ...prevStatus };
          successfulPurchases.forEach((productName: string) => {
            updatedStatus[productName] = true;
          });
          return updatedStatus;
        });

        // Fetch Products
        const productsData = await client.fetch(`*[_type == "product"]{
          _id,
          name,
          description,
          price,
          discountPrice,
          image,
          "pdfUrl": pdfFile.asset->url
        }`);

        setProducts(productsData);
        setIsProductsLoading(false); // Set to false when products are loaded

        // Only set isLoading to false after products are fetched
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing purchase:', error);
        setIsLoading(false);
      }
    };

    // Only call recordPurchaseAndFetchProducts if we haven't processed the session yet
    if (!hasProcessed && session_id) {
      recordPurchaseAndFetchProducts();
    }
  }, [searchParams, user, hasProcessed]); // Depend only on searchParams, user, and hasProcessed

  // Filter purchased products based on purchaseStatus
  const purchasedProducts = products.filter(product => purchaseStatus[product.name]);

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Processing Your Purchase</h2>
          <p>Please do not close or refresh this page.</p>
          <p>We are preparing your digital products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <h1 className='title'>Thank You for Your Purchase!</h1>
      
      <div className="purchase-summary">
        <h2>Your Digital Products</h2>
        <p>Your products are ready for download. Please find them below:</p>
      </div>

      <div className="download-instructions">
        <h3>Download Instructions</h3>
        <p>Click on the download button to access your purchase.</p>
        
        {/* Show spinner while products are loading */}
        {isProductsLoading && (
          <div className="spinner"></div>
        )}
      </div>

      {/* Show ProductListing once products are loaded */}
      {!isProductsLoading && (
        <ProductListing 
          products={purchasedProducts} 
          purchaseStatus={purchaseStatus} 
        />
      )}

      <button
        className='continueButton'
        onClick={() => router.push('/products')}
      >
        See other Tests
      </button>
    </div>
  );
}
