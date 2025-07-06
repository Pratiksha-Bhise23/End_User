

import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp || !decoded.phone) {
        return false;
      }
      const currentTime = Date.now() / 1000;
      return decoded.exp >= currentTime;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    if (checkToken(token)) {
      const decoded = jwtDecode(token);
      setUser({ phone: decoded.phone });
      setIsAuthenticated(true);

      const expirationTime = decoded.exp * 1000;
      const timeout = expirationTime - Date.now();
      if (timeout > 0) {
        const timer = setTimeout(() => {
          logout();
        }, timeout);
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    } else {
      logout();
    }
  }, [navigate, location.pathname]);

  const loginUser = (token) => {
    localStorage.setItem('sessionToken', token);
    if (checkToken(token)) {
      const decoded = jwtDecode(token);
      setUser({ phone: decoded.phone });
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    } else {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('sessionToken');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);