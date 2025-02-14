import React, { useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import logo from "../assets/img.png";
import {toast} from "react-toastify";
import {UserContext} from "../contexts/UserContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const { isLoggedIn, logout, user } = useContext(UserContext);

    // Fonction pour obtenir les initiales de l'utilisateur
    const getUserInitials = () => {
        if (!user || !user.user) return '';
        const username = user.user.username || '';
        return username.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("https://jdr-lotr-back.onrender.com/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.logout) {  // Vérifiez la propriété logout ici
            localStorage.removeItem("token");
            logout();
            navigate("/auth/login");
        } else {
            toast.error("Erreur lors de la déconnexion");
        }
    };

    return (
        <nav className="p-4 bg-white dark:bg-gray-700 shadow-md transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-24 h-20" />

                <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Jeu
                </Link>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleDarkMode}
                        className="px-4 py-2 rounded-lg flex items-center transition-colors duration-300 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                        {darkMode ? (
                            <SunIcon className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <MoonIcon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    {isLoggedIn ? (
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                                title="Voir mon profil"
                            >
                                {getUserInitials()}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/auth/login"
                                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                            >
                                Connexion
                            </Link>
                            <Link
                                to="/auth/register"
                                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                            >
                                Inscription
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
