/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('gaming_platform_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async ({ role, username, password }) => {
        const { user: backendUser } = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ role, username, password }),
        });

        setUser(backendUser);
        localStorage.setItem('gaming_platform_user', JSON.stringify(backendUser));
        return backendUser;
    };

    const register = async ({ username, email, password }) => {
        const { user: backendUser } = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });

        setUser(backendUser);
        localStorage.setItem('gaming_platform_user', JSON.stringify(backendUser));
        return backendUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gaming_platform_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
