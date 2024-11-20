'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/tof.module.css';



// Define an interface for the API response
interface TermsResponse {
  success: boolean;
  terms_text?: string;
  message?: string;
}

// Props interface for flexibility
interface TermsOfServiceProps {
  language?: string;
  termsType?: string;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ 
  language = 'en', 
  termsType = 'privacy policy' 
}) => {
  const [termsText, setTermsText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermsText = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/terms`);
        url.searchParams.append('action', 'text');
        url.searchParams.append('language', language);
        url.searchParams.append('terms_type', termsType);
    
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
          // If response is JSON, parse it
          const data: TermsResponse = await response.json();
          if (data.success && data.terms_text) {
            setTermsText(data.terms_text);
          } else {
            setError(data.message || 'Failed to fetch terms');
          }
        } else if (contentType?.includes('text/plain')) {
          // If response is plain text, handle it as such
          const text = await response.text();
          setTermsText(text);
        } else {
          throw new Error('Unexpected content type from API');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    

    fetchTermsText();
  }, [language, termsType]);

  if (loading) {
    return (
      <div className={styles.termsContainer}>
        <div className={styles.loading}>
          <p>Loading terms of service...</p>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.termsContainer} ${styles.error}`}>
        <div className={styles.errorMessage}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.termsContainer}>
      <div className={styles.termsContent}>
        {termsText ? (
          <div 
            className={styles.termsText}
            dangerouslySetInnerHTML={{ __html: termsText }}
          />
        ) : (
          <p>No terms of service available.</p>
        )}
      </div>
    </div>
  );
};

export default TermsOfService;
