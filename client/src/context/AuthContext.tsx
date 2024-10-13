import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  jwt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const login = async (identifier: string, password: string) => {
    console.log("LOGIN TRY")
    try {
        console.log("INSIDE TRY")
        console.log(import.meta.env.VITE_APP_STRAPI_API_URL, "url?")
      const response = await axios.post(`${import.meta.env.VITE_APP_STRAPI_API_URL}/auth/local`, {
        identifier,
        password,
      });
      console.log(response.data, "response")
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_STRAPI_API_URL}/auth/local/register`, {
        username,
        email,
        password,
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
