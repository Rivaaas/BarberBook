'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('barberbook_token');
    const storedUser = localStorage.getItem('barberbook_user');
    if (stored) { setToken(stored); setUsername(storedUser); }
    setLoading(false);
  }, []);

  const login = (newToken, user) => {
    localStorage.setItem('barberbook_token', newToken);
    localStorage.setItem('barberbook_user', user);
    setToken(newToken);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('barberbook_token');
    localStorage.removeItem('barberbook_user');
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
