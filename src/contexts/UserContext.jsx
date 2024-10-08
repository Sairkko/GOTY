import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const API_URL = import.meta.env.VITE_APP_API_URL;

    const register = async (values) => {
        setLoading(true);
        const { firstname, email, lastname, username, password } = values;

        try {
            const response = await axios.post(`${API_URL}/register`, {
                firstname,
                email,
                lastname,
                username,
                password
            });

            const data = response.data;
            setLoading(false);

            if (data.id) {
                return { success: true };
            } else {
                toast.error('Une erreur est survenue lors de l\'inscription.');
                return { success: false };
            }
        } catch (error) {
            setLoading(false);
            toast.error('Erreur lors de la requête.');
            return { success: false };
        }
    };

    const login = async (values) => {
        const { email, password } = values;

        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            const data = response.data;

            if (data.token) {
                localStorage.setItem("token", data.token);
                setUser(data.token);
                setIsLoggedIn(true);
                toast.success('Connexion réussie !');
                return { success: true };
            } else {
                toast.error('Échec de la connexion. Veuillez vérifier vos informations.');
                return { success: false };
            }
        } catch (error) {
            toast.error('Erreur lors de la connexion.');
            return { success: false };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
        toast.success('Déconnexion réussie.');
        return { success: true };
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ email: "exemple@mail.com" });
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, isLoggedIn, register, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
