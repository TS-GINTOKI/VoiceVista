// src/context/AuthContext.jsx (Final, Clean Version)
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Create the context. The value will be provided by the AuthProvider.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        try {
            if (storedToken && storedUser) {
                api.setAuthToken(storedToken); 
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            localStorage.clear(); // Clear corrupted data
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        api.setAuthToken(userData.token);
        setUser(userData.user);
    };

    const logout = () => {
        localStorage.clear();
        api.setAuthToken(null);
        setUser(null);
    };

    const value = { user, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// This hook is now safe to use by any component INSIDE the provider.
export const useAuth = () => {
    return useContext(AuthContext);
};
