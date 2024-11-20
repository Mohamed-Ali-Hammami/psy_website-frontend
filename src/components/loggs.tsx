"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../app/context/AuthContext';
import styles from '../styles/loggs.module.css';
import SignUpForm from '../components/RegisterForm';
import LogInForm from '../components/LoginForm';

const UserAvatarDropdown: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<"login" | "signup" | "none">("none");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isLoggedIn, logout } = useAuth();

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
        if (activeModal !== "none") setActiveModal("none"); // Close any open modal when toggling dropdown
    };

    const handleLoginClick = () => setActiveModal("login");
    const handleRegisterClick = () => setActiveModal("signup");
    const handleLogoutClick = () => {
        logout();
        setDropdownOpen(false);
    };

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeModal = () => setActiveModal("none");

    return (
        <>
            <div ref={dropdownRef} className={`${styles.profileContainer} ${dropdownOpen ? styles['dropdown-active'] : ''}`}>
                <div className={styles.iconWithText}>
                    <Image
                        src="/images/user-avatar.svg"
                        alt="User  Avatar"
                        className={styles['user-avatar']}
                        width={40}
                        height={40}
                        onClick={toggleDropdown}
                        aria-label="User  avatar dropdown"
                    />
                    <span className={styles.avatar_text} onClick={toggleDropdown}>
                        {isLoggedIn ? 'Logout' : 'Login/Register'}
                    </span>
                </div>
                {dropdownOpen && (
                    <div className={styles['dropdown-menu']}>
                        {isLoggedIn ? (
                            <div className={styles.dropdownItemLogout} onClick={handleLogoutClick}>
                                Logout
                            </div>
                        ) : (
                            <>
                                <div onClick={handleRegisterClick} className={styles.dropdownItemRegister}>
                                    Register
                                </div>
                                <div onClick={handleLoginClick} className={styles.dropdownItemLogin}>
                                    LogIn
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            {activeModal !== "none" && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {activeModal === "signup" && <SignUpForm onClose={closeModal}  />}
                        {activeModal === "login" && <LogInForm onClose={closeModal}  />}
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatarDropdown;