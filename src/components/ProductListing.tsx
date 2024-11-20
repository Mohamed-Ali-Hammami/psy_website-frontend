"use client";
import React from 'react';
import ProductCard from './ProductCard';
import { useCart } from '../app/context/CartContext';
import styles from '../styles/ProductListing.module.css';

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
  pdfUrl?: string; // PDF URL for product information
}

interface ProductListingProps {
  products: Product[];
  purchaseStatus?: { [productName: string]: boolean }; // Make purchaseStatus optional
  loading?: boolean; // Loading state
}

export default function ProductListing({ products, purchaseStatus = {}, loading = false }: ProductListingProps) {
  const { addToCart } = useCart();

  return (
    <div className={styles.productListingContainer}>
      {/* Loading State */}
      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.productListing}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              isPurchased={purchaseStatus[product.name] || false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
