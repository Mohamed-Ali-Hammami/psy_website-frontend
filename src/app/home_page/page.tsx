// src/pages/home_page.tsx (or wherever your components are)
"use client";
import React, { useEffect, useState } from 'react';
import { client } from '../../sanity/lib/client';
import Carousel from '../../components/Caroussel';
import ProductListing from '../../components/ProductListing';
import ContactUsForm from '@/components/ContactUsForm';

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

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const products: Product[] = await client.fetch('*[_type == "product"]');
      setProducts(products);
    };

    fetchProducts();
  }, []);
  
  const toggleContactForm = () => {
    setContactFormOpen(!contactFormOpen);
  };
  
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Understanding with [Your Website Name]</h1>
          <p>Gain profound insights into your personality, cognitive capabilities, and emotional intelligence through our meticulously designed psychological assessments.</p>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features">
        <div className="feature">
          <i className="icon-scientifically-backed"></i>
          <h3 className="feature-title">Scientifically Validated</h3>
          <p className="feature-details">Our assessments are meticulously designed based on rigorous empirical research and established psychological principles, ensuring their reliability and precision in evaluating mental health and cognitive abilities.</p>
        </div>
        <div className="feature">
          <i className="icon-accessibility"></i>
          <h3 className="feature-title">Accessible for All</h3>
          <p className="feature-details">Designed with inclusivity in mind, our platform ensures that everyone can easily access and complete assessments, regardless of their background or technical proficiency.</p>
        </div>
        <div className="feature">
          <i className="icon-comprehensive-results"></i>
          <h3 className="feature-title">In-Depth Insights</h3>
          <p className="feature-details">Receive thorough evaluations and personalized feedback, equipping you with actionable insights to support your personal and professional development.</p>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <h2 className="carousel-title">Featured Assessments</h2>
        <Carousel toggleContactForm={toggleContactForm} />
        {contactFormOpen && (
          <div className="modalOverlay" onClick={toggleContactForm}>
            <div onClick={(e) => e.stopPropagation()}>
              <ContactUsForm onClose={() => setContactFormOpen(false)} />
            </div>
          </div>
        )}
      </section>

      {/* Product Listing Section */}
      <section id="products" className="product-listing">
        <h2 className="product-listing-title">Explore Our Comprehensive Psychological Tests</h2>
        <p className="product-listing-subtitle">Discover the assessment that aligns with your needs and embark on a journey of self-discovery and personal development.</p>
        <div className="products">
          {products.length > 0 ? (
            <ProductListing products={products} />
          ) : (
            <p>Our catalog is currently undergoing updates. We invite you to return soon for new and enhanced assessments!</p>
          )}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Are You Ready to Explore Your Inner Self?</h2>
        <p>Take the initial step toward understanding yourself better and fostering personal growth.</p>
        <a href="/products" className="cta-button">Start Your Journey</a>
      </section>
    </div>
  );
};

export default HomePage;
