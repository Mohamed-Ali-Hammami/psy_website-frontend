import React, { useState } from 'react';
import styles from '../styles/RegisterForm.module.css';
import { useAuth } from '../app/context/AuthContext';
import SignUpForm from '../components/RegisterForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    identifier: string;
    password: string;
}

const LogInForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<FormData>({ identifier: '', password: '' });
    const [errors, setErrors] = useState({
        identifierValid: true,
        loginError: false,
        loginMessage: '',
    });
    const [loading, setLoading] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const toggleForgotPassword = () => {
        setShowForgotPassword((prev) => !prev);
    };

    const validateIdentifier = (identifier: string) =>
        /\S+@\S+\.\S+/.test(identifier) || identifier.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForgotPasswordEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const identifierValid = validateIdentifier(formData.identifier);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            identifierValid,
            loginError: false,
            loginMessage: '',
        }));
    
        if (identifierValid) {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
    
                if (response.ok) {
                    const data = await response.json();
    
                    // Assuming user_id might also be returned in the response
                    const user = {
                        exp: data.exp, // Assuming expiration timestamp is returned
                        user_id: data.user_id, // Assuming user ID is returned
                        role: data.is_superuser ? 'superuser' : 'user', // Set role based on is_superuser flag
                    };
    
                    // Now login with the token and the user object
                    login(data.token, user); // Pass both token and user object to the login function
                    toast.success('Logged in successfully!');
                    // Redirect based on the user's role
                    if (data.is_superuser) {
                        window.location.href = '/superuser_dashboard'; // Redirect to superuser dashboard
                    } else {
                        window.location.href = '/dashboard'; // Redirect to regular user dashboard
                    }
                } else {
                    const errorData = await response.json();
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        loginError: true,
                        loginMessage: errorData.message || 'Login failed. Please check your credentials.',
                    }));
                }
            } catch (error) {
                console.error('Error logging in:', error);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    loginError: true,
                    loginMessage: 'An error occurred. Please try again later.',
                }));
            } finally {
                setLoading(false);
            }
        }
    };
    

    const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
        if (!forgotPasswordEmail) {
            toast.error('Please enter a valid email address.');
            return;
        }
    
        setForgotPasswordLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                toast.success('Password reset link has been sent to your email');
                setShowForgotPassword(false);
            } else if (responseData.message === 'User Not Found') {
                toast.error('User not found. Please check the email address.');
            } else {
                toast.error(responseData.message || 'Error sending password reset link');
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setForgotPasswordLoading(false);
        }
    };
    

    if (showSignUpForm) {
        return <SignUpForm onClose={() => setShowSignUpForm(false)} />;
    }

    return (
        <div className={styles.wrapper}>
            <ToastContainer />
        {/* Include the colorlib-bubbles here */}
        <ul className={styles.colorlibbubblesRegister}>
            {Array.from({ length: 20 }).map((_, index) => (
                <li key={index}></li>
            ))}
        </ul>
            <h1 className={styles.customh1}>Login</h1>
            <form onSubmit={handleSubmit} className={styles.formInput}>
                <input
                    type="text"
                    name="identifier"
                    placeholder="Username or Email"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    className={styles.inputField}
                />
                {!errors.identifierValid && (
                    <span className={styles.error}>Invalid username or email format</span>
                )}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.inputField}
                />
                {errors.loginError && (
                    <span className={styles.error}>{errors.loginMessage}</span>
                )}
                <p className={styles.customp}>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? <div className={styles.loadingSpinner}></div> : 'LOGIN'}
                    </button>
                </p>
                <p className={styles.customp}>
                    Don&apos;t have an Account?{' '}
                </p>
                <div className={styles.buttonContainer}>
                <button
                        className={styles.customButton}
                        onClick={() => setShowSignUpForm(true)}
                    >
                        Create Now!
                    </button>
                <p className={styles.customp}>
                    <button
                        type="button"
                        onClick={toggleForgotPassword}
                        className={styles.customButton}
                    >
                        Forgot Password?
                    </button>
                </p>
                </div>
            </form>
            {showForgotPassword && (
                <div className={styles.forgotPasswordForm}>
                    <h2>Reset Your Password</h2>
                    <form onSubmit={handleForgotPasswordSubmit} className={styles.formInput}>
                        <span className={styles.warningmessage}>A new password will be sent to your registered email address. Your old password will no longer be valid.</span>
                        <input
                            type="email"
                            name="forgotPasswordEmail"
                            placeholder="Enter your email"
                            value={forgotPasswordEmail}
                            onChange={handleForgotPasswordChange}
                            required
                        />
                        <button
                            type="submit"
                            disabled={forgotPasswordLoading}
                            className={styles.submitButton}
                        >
                            {forgotPasswordLoading ? (
                                <div className={styles.loadingSpinner}></div>
                            ) : (
                                'Get a New Password'
                            )}
                        </button>
                    </form>
                    
                </div>
            )}
             
            <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close"
            >
                &times;
            </button>
        </div>
    );
};

export default LogInForm;
