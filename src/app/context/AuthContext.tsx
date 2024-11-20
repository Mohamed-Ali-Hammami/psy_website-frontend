import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  user_id?: number;
  role?: string; // Add role (superuser or user)
  superuser_id?: number; // Add superuser_id for superuser specific data
}

interface AuthContextType {
  isLoggedIn: boolean;
  isSuperuser: boolean; // Track if the user is a superuser
  user?: DecodedToken; // Include user data if needed
  token?: string; // Store the token for authenticated requests
  login: (token: string, user: DecodedToken) => void; // Accept both token and user for login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthContext with token and user state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
  const [user, setUser] = useState<DecodedToken | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined); // Initialize with undefined
  const [loading, setLoading] = useState<boolean>(true); // Add loading state to wait for sync

  // Sync auth state from localStorage
  const syncAuthState = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setUser(decoded);
          setIsSuperuser(decoded.role === 'superuser');
          setToken(storedToken);  // Set token in state
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // Set loading to false after sync is done
  };
  

  useEffect(() => {
    syncAuthState();
  }, []);

  const login = (token: string, user: DecodedToken) => {
    localStorage.setItem('token', token);
    setToken(token);  // Store token in state
    setIsLoggedIn(true);
    setUser(user);
    setIsSuperuser(user.role === 'superuser');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(undefined);
    setIsLoggedIn(false);
    setIsSuperuser(false);
    setUser(undefined);
    window.location.href = '/';  // Redirect to login
  };

  // If still loading, prevent rendering child components
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isSuperuser, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
