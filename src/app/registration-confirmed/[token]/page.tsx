"use client";
import { useEffect, useState, useRef } from 'react';
import '../../registration-confirmed/registration_confirmed.css';
import LogInForm from '@/components/LoginForm';
import { useRouter } from 'next/navigation';

const ConfirmPage = ({ params }: { params: { token: string } }) => {
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [emailConfirmed, setEmailConfirmed] = useState(false); // Track if email is confirmed
  const { token } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const hasConfirmed = useRef(false); // Track if email confirmation has already been attempted

  useEffect(() => {
    if (token && !emailConfirmed && !hasConfirmed.current) {
      const confirmEmail = () => {
        // Mark as attempted to prevent re-triggering the API call
        hasConfirmed.current = true;

        fetch(`${apiUrl}/api/confirm-email/${token}`, {
          method: 'GET',
        })
          .then((response) => {
            if (response.ok) {
              setStatus('confirmed');
              setEmailConfirmed(true);  // Set to true to avoid re-running the function
            } else {
              setStatus('failed');
            }
          })
          .catch((error) => {
            console.error('Error confirming email:', error);
            setStatus('failed');
          });
      };

      confirmEmail();
    }
  }, [token, apiUrl, emailConfirmed]);  // Add emailConfirmed to dependency array

  const handleLoginRedirect = () => {
    router.push('/dashboard');
  };

  return (
    <div className='container'>
      <div className='messageContainer'>
        {status === 'pending' && (
          <>
            <h1 className='heading'>Confirming Your Email...</h1>
            <p className='text'>Please wait while we confirm your email address.</p>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <h1 className='heading'>Email Confirmed</h1>
            <p className='text'>Your email has been successfully confirmed. You can now proceed with logging in!</p>
            <LogInForm onClose={handleLoginRedirect} />
          </>
        )}
        {status === 'failed' && (
          <>
            <h1 className='heading_failed'>Confirmation Failed</h1>
            <p className='text'>There was an issue confirming your email. Please try again or contact support.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmPage;
