"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { slidesData } from '../data/constants';
import styles from '../styles/Caroussel.module.css';

// Define the props type
interface CarouselProps {
  toggleContactForm: () => void; // Define toggleContactForm as a function
}

const Carousel: React.FC<CarouselProps> = ({ toggleContactForm }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    const intervalId = setInterval(handleNext, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  return (
    <div className={styles.carouselContainer}>
      {slidesData.map((slide, index) => (
        <div
          key={index}
          className={`${styles.carouselSlide} ${
            index === currentIndex
              ? styles.active
              : isTransitioning
              ? styles.exit
              : ''
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            className={styles.carouselImage}
            fill
            sizes="(max-width: 800px) 100vw, 800px"
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.carouselOverlay}>
            <h2>{slide.title}</h2>
            <p>{slide.content.text}</p>
            {slide.content.list && (
              <ul>
                {slide.content.list.map((item, idx) => (
                  <li key={idx}>{item.text}</li>
                ))}
              </ul>
            )}
            {slide.content.link && (
              <a
                href={slide.content.link.href}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  if (slide.id === 6) {
                    toggleContactForm(); // Call the toggleContactForm function
                  }
                }}
                className={styles.carouselLink}
              >
                {slide.content.link.text}
              </a>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={handlePrev}
        className={styles.carouselButton}
        aria-label="Previous slide"
      >
        <Image src="/images/left.svg" alt="Previous" fill style={{ objectFit: 'cover' }} />
      </button>
      <button
        onClick={handleNext}
        className={styles.carouselButton}
        aria-label="Next slide"
      >
        <Image src="/images/right.svg" alt="Next" fill style={{ objectFit: 'cover' }} />
      </button>
    </div>
  );
};

export default Carousel;
