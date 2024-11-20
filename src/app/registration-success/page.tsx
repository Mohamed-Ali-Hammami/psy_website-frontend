"use client";
import React from 'react';
import './registration_success.css';

const RegistrationSuccessPage: React.FC = () => {

    const handleGoToDashboard = () => {
        window.location.href = '/dashboard'; 
    };

    return (
        <div className='successWrapper'>
            <h1 className='successTitle'>Registration Successful!</h1>
            <p className='successMessage'>
                Thank you for registering! We&apos;ve sent a confirmation email to your email address. 
                Please check your inbox and click on the link to activate your account.
            </p>
            <button className='GotoDashboard' onClick={handleGoToDashboard}>
                Go to Dashboard
            </button>
        </div>
    );
};

export default RegistrationSuccessPage;
