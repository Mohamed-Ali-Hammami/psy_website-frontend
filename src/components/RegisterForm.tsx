"use client";
import React, { useState } from 'react';
import styles from '../styles/RegisterForm.module.css';
import LogInForm from '../components/LoginForm';
import CountryList from 'react-select-country-list';
import PhoneInput from 'react-phone-input-2';
import TermsOfService from './Terms_of_services';
import 'react-phone-input-2/lib/style.css';
import Select, { 
    SingleValue, 
    StylesConfig, 
    MultiValue
} from 'react-select';
  import { GroupBase } from 'react-select';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SignUpForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
        country: '',
        address: '',
        agreeToTerms: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [errors, setErrors] = useState({
        passwordMatch: true,
        emailValid: true,
        termsAccepted: true,
        firstNameValid: true,
        lastNameValid: true,
        usernameValid: true,
        phoneValid: true,
        registrationError: false,
        registrationMessage: '',
    });

    const [showModal, setShowModal] = useState(false);

    const countryOptions: CountryOption[] = CountryList().getData().map(country => ({
        value: country.value,
        label: country.label
    }));

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validateName = (name: string) => /^[A-Za-z]+(?:[' -][A-Za-z]+)*$/.test(name);
    const validateUsername = (username: string) => /^[a-zA-Z0-9._]{3,20}$/.test(username);
    const validatePassword = (password: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    const validatePhoneNumber = (phone: string) => /^[0-9]{7,15}$/.test(phone); // Accepts 7–15 digits.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    
        // Reset error state if the input is empty
        if (value.trim() === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`${name}Valid`]: true,
                passwordMatch: true, // Reset password match error
                emailValid: true, // Reset email error
                firstNameValid: true, // Reset first name error
                lastNameValid: true, // Reset last name error
                usernameValid: true, // Reset username error
                phoneValid: true, // Reset phone error
            }));
            return; // Exit early if the field is empty
        }
    
        // Validate fields on input change
        if (name === 'password' || name === 'confirmPassword') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordMatch: formData.password === value || (name === 'confirmPassword' && value === formData.password),
            }));
        }
    
        if (name === 'email') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                emailValid: validateEmail(value),
            }));
        }
        if (name === 'first_name') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                firstNameValid: validateName(value),
            }));
        }
        if (name === 'last_name') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                lastNameValid: validateName(value),
            }));
        }
        if (name === 'username') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                usernameValid: validateUsername(value),
            }));
        }
        if (name === 'phone_number') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phoneValid: validatePhoneNumber(value),
            }));
        }
    };

    interface CountryOption {
        value: string;
        label: string;
      }

    // Use the defined type in customStyles
    const customStyles: StylesConfig<CountryOption, boolean, GroupBase<CountryOption>> = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            margin: '10px 0',
            borderColor: state.isFocused ? '#424' : '#ccc',
            borderRadius: '20px',
            boxShadow: state.isFocused ? '0 0 0 1px #424' : 'none',
            '&:hover': {
                borderColor: '#424',
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: 'rgba(0, 0, 0, 0.438)',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#f4f4f4' : 'white',
            color: state.isSelected ? '#424' : 'black',
            '&:active': {
                backgroundColor: '#4CAF50',
            },
        }),
        menu: (base) => ({
            ...base,
            zIndex: 5,
        }),
        singleValue: (base) => ({
            ...base,
            color: '#fff',
        }),
    };
    
    const handleCountryChange = (
        newValue: SingleValue<CountryOption> | MultiValue<CountryOption>, 
    ) => {
        if (newValue && 'value' in newValue) {
            setFormData((prev) => ({
                ...prev,
                country: newValue.value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                country: '',
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const passwordMatch = formData.password === formData.confirmPassword;
        const passwordStrong = validatePassword(formData.password);
        const termsAccepted = formData.agreeToTerms;

        setErrors((prevErrors) => ({
            ...prevErrors,
            passwordMatch,
            termsAccepted,
        }));

        if (passwordMatch && passwordStrong && termsAccepted && errors.emailValid && errors.firstNameValid && errors.lastNameValid && errors.usernameValid && errors.phoneValid) {
            try {
                const response = await fetch(`${apiUrl}/api/create-account`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                        phone_number: formData.phone_number,
                        country: formData.country,
                        address: formData.address,
                    }),
                });

                if (response.ok) {
                    const emailResponse = await fetch(`${apiUrl}/api/send-confirmation-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: formData.email }),
                    });

                    if (emailResponse.ok) {
                        setFormData({
                            first_name: '',
                            last_name: '',
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            phone_number: '',
                            country: '',
                            address: '',
                            agreeToTerms: false,
                        });
                        setErrors({
                            ...errors,
                            registrationMessage: 'Registration successful! Please check your email to confirm your account.',
                        });
                        setTimeout(() => window.location.href = '/registration-success', 1500);
                    } else {
                        throw new Error('Failed to send confirmation email');
                    }
                } else {
                    const errorData = await response.json();
                    setErrors({
                        ...errors,
                        registrationError: true,
                        registrationMessage: errorData.message || 'Registration failed. Please try again.',
                    });
                }
            } catch (error) {
                console.error('Registration error:', error);
                setErrors({
                    ...errors,
                    registrationError: true,
                    registrationMessage: 'An error occurred. Please try again later.',
                });
            }
        }

        setIsLoading(false);
    };

    if (showLogin) {
        return <LogInForm onClose={() => setShowLogin(false)} />;
    }

    return (
        <div className={styles.wrapper}>
            {/* Include the colorlib-bubbles here */}
        <ul className={styles.colorlibbubblesRegister}>
                {Array.from({ length: 20 }).map((_, index) => (
                    <li key={index}></li>
            ))}
            </ul>
            <button 
                className={styles.closeButton} 
                onClick={(e) => {
                    e.preventDefault();
                    onClose();
                }} 
                aria-label="Close"
            >
                &times;
            </button>
            <h1 className={styles.customh1}>Create Account</h1>
            <form onSubmit={handleSubmit} className={styles.formInput}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                {!errors.firstNameValid && <span className={styles.error}>Invalid first name</span>}
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                {!errors.lastNameValid && <span className={styles.error}>Invalid last name</span>}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                {!errors.usernameValid && <span className={styles.error}>Invalid username</span>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {!errors.emailValid && <span className={styles.error}>Invalid email format</span>}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                {!errors.passwordMatch && formData.confirmPassword && (
                    <span className={styles.error}>Passwords do not match</span>
                )}
                
                <PhoneInput
                    country={'us'} // Default country code
                    value={formData.phone_number}
                    onChange={(phone) => setFormData((prev) => ({ ...prev, phone_number: phone }))}
                    placeholder="Phone Number"
                    inputStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderColor: errors.phoneValid ? '#424' : 'red', // Red border for invalid input
                        borderRadius: '20px',
                        width: '100%',
                    }}
                    buttonStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderColor: '#424',
                        borderRadius: '20px 20px',
                        padding:'10px'
                    }}
                    containerStyle={{
                        marginBottom: '1rem', // Adjust spacing
                    }}
                />
                
                {!errors.phoneValid && <span className={styles.error}>Invalid phone number</span>}
                <Select<CountryOption, false>
                    options={countryOptions}
                    value={countryOptions.find(option => option.value === formData.country) || null}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                    styles={customStyles}
                    isSearchable={true}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address (optional)"
                    value={formData.address}
                    onChange={handleChange}
                />
                <div className={styles.wthreeText}>
                    <label className={styles.anim}>
                        <input
                            className={styles.checkbox}
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            required
                        />
                        <span
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(true);
                            }} 
                            className={styles.termsButton}
                        >
                            ← I Agree To The Terms & Conditions
                        </span>
                    </label>
                    {!errors.termsAccepted && <span className={styles.error}>You must accept the terms</span>}
                </div>
                    <div className={styles.customp}>
                        <button type="submit" disabled={isLoading} className={styles.customButton}>   
                            {isLoading ?  <div className={styles.loadingSpinner}></div> : "SIGN UP"}
                        </button>
                        {errors.registrationError && <span className={styles.error}>{errors.registrationMessage}</span>}
                        <p className={styles.customp}>
                            Already have an account?{" "}
                            </p>
                            <button
                                className={styles.customButton}
                                onClick={() => setShowLogin(true)}
                            >
                                Login Now!
                            </button>
                        
                    </div>
                
            {/* Modal for Terms & Conditions */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                        <span 
                                className={styles.closeModalButton                                } 
                                onClick={() => setShowModal(false)} 
                                role="button" 
                                tabIndex={0} 
                                onKeyPress={(e) => e.key === 'Enter' && setShowModal(false)} // Allow closing with Enter key
                                aria-label="Close modal" // Accessibility label
                            >
                                &times;
                            </span>
                            Privacy Policy
                        </div>
                        <TermsOfService/>
                    </div>
                </div>
            )}
            </form>

        
        </div>

);
};

export default SignUpForm;