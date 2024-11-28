"use client";
import { useState } from 'react';
import { urlFor } from '../sanity/lib/image';
import Image from 'next/image';
import styles from '../styles/ProductCard.module.css';
import ProductDetails from './ProductDetails'; // Import ProductDetails

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

interface ProductCardProps {
  product: Product;
  addToCart: (item: { _id: string; name: string; price: number; image: string }) => void;
  isPurchased: boolean;
}

export default function ProductCard({ product, addToCart, isPurchased }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false); // State to control showing details

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: urlFor(product.image).url(),
    });
  };

  const handleDownload = async () => {
    if (product.pdfUrl) {
      try {
        const response = await fetch(product.pdfUrl);
        const blob = await response.blob();

        // Create a new link for the blob
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${product.name}.pdf`;

        // Append to the document and trigger download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  const handleShowDetails = () => {
    setShowDetails(true); // Show details modal
  };

  const handleCloseDetails = () => {
    setShowDetails(false); // Close details modal
  };

  return (
    <div className={styles['product-card']}>
      <Image
        className={styles['product-img']}
        src={urlFor(product.image).url()}
        alt={product.name}
        width={327}
        height={420}
        priority
        style={{ objectFit: 'cover' }}
      />
      <div className={styles['product-info']}>
        <div className={styles['product-text']}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
        </div>

        {/* Conditionally render buttons, price, and download section */}
        <div className={styles['price-and-cart']}>
          {product.discountPrice ? (
            <>
              <p className={styles['discount-price']}>
                ${product.discountPrice.toFixed(2)}
              </p>
              <p className={styles['original-price']}>
                <span className={styles['price-span']}>
                  ${product.price.toFixed(2)}
                </span>
              </p>
            </>
          ) : (
            <p>
              <span>${product.price.toFixed(2)}</span>
            </p>
          )}
          {!isPurchased && (
            <button
              type="button"
              onClick={handleAddToCart}
              className={styles['add-to-cart-button']}
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Conditionally render the download button if purchased */}
        {isPurchased && (
          <button
            onClick={handleDownload}
            className={`${styles['product-button']} ${styles['download-button']}`}
          >
            Download
          </button>
        )}

        <button
          type="button"
          onClick={handleShowDetails} // Show the product details
          className={styles['product-button']}
        >
          See Details
        </button>
      </div>

      {/* Conditionally render ProductDetails modal */}
      {showDetails && <ProductDetails product={product} onClose={handleCloseDetails} />}
    </div>
  );
}
