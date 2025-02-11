import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
            const response = await axios.post(`/api/register`, {
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
            const response = await axios.post(`/api/login`, {
                email,
                password
            });

            const data = response.data;

            if (data.token) {
                const decodedToken = jwtDecode(data.token);  // Décoder le token JWT

                // Stocker le token et l'utilisateur décodé dans localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(decodedToken));  // Stocke l'utilisateur en tant que chaîne JSON

                // Mettre à jour l'état avec le token et les infos utilisateur décodées
                setUser({ token: data.token, user: decodedToken });
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
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
        toast.success('Déconnexion réussie.');
        return { success: true };
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        let storedUser = localStorage.getItem("user");

        // Vérifie si storedUser est un objet ou une chaîne
        try {
            storedUser = typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
        } catch (error) {
            console.error("Erreur lors du parsing JSON de l'utilisateur : ", error);
            storedUser = null;
        }

        if (token && storedUser) {
            setUser({ token: token, user: storedUser });
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, isLoggedIn, register, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
