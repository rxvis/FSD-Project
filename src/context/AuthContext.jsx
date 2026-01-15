import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Try to load user from localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('gaming_platform_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (role, username) => {
        const newUser = { role, username, id: Date.now().toString() };
        setUser(newUser);
        localStorage.setItem('gaming_platform_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gaming_platform_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
