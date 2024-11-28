"use client";
import React from 'react';
import { urlFor } from '../sanity/lib/image';
import Image from 'next/image';
import styles from '../styles/ProductDetails.module.css'; // Ensure the path is correct

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
}

interface ProductDetailsProps {
  product: Product;
  onClose: () => void; // Function to close the modal
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose }) => {
  return (
    <div className={styles['product-details-modal']}>
      <div className={styles['product-details-content']}>
        <button onClick={onClose} className={styles['close-button']}>×</button>
        <div className={styles['product-details']}>
          <div className={styles['image-container']}>
            <Image
              src={urlFor(product.image).url()}
              alt={product.name}
              width={327}
              height={420}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className={styles['details-container']}>
            <h2 className={styles['product-name']}>{product.name}</h2>
            <p className={styles['product-description']}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
