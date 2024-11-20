"use client";
import { urlFor } from '../sanity/lib/image';
import Image from 'next/image';
import styles from '../styles/ProductCard.module.css';

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
  pdfUrl?: string; // Update to directly reference the PDF URL
}

interface ProductCardProps {
  product: Product;
  addToCart: (item: { _id: string; name: string; price: number; image: string }) => void;
  isPurchased: boolean; // Add this prop
}

export default function ProductCard({ product, addToCart, isPurchased }: ProductCardProps) {
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
  

  return (
    <div className={styles['product-card']}>
        <Image className={styles['product-img']}
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
        <div className={styles['product-price-btn']}>
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
          {isPurchased ? (
            <button onClick={handleDownload} className={`${styles['product-button']} ${styles['download-button']}`}>
              Download
            </button>
          ) : (
            <button type="button" onClick={handleAddToCart} className={styles['product-button']}>
              Buy now
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
