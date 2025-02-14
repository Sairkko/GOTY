import React, { useContext, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import logo from "../assets/img.png";
import {toast} from "react-toastify";
import {UserContext} from "../contexts/UserContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const { isLoggedIn, logout, user } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        if (data.logout) {
            localStorage.removeItem("token");
            logout();
            navigate("/auth/login");
            setIsMenuOpen(false);
        } else {
            toast.error("Erreur lors de la déconnexion");
        }
    };

    return (
        <nav className="p-4 bg-white dark:bg-gray-700 shadow-md transition-colors duration-300">
            <div className="container mx-auto">
                {/* Desktop Navigation */}
                <div className="flex justify-between items-center">
                    <img src={logo} alt="Logo" className="w-24 h-20" />

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        {isMenuOpen ? (
                            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-white" />
                        ) : (
                            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-white" />
                        )}
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Jeu
                        </Link>

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

                {/* Mobile Menu */}
                <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
                    <div className="flex flex-col space-y-4">
                        <Link 
                            to="/" 
                            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Jeu
                        </Link>

                        <div className="flex justify-center">
                            <button
                                onClick={toggleDarkMode}
                                className="px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                                {darkMode ? (
                                    <SunIcon className="w-5 h-5 text-yellow-400" />
                                ) : (
                                    <MoonIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                        </div>

                        {isLoggedIn ? (
                            <div className="flex flex-col space-y-4">
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl mx-auto"
                                    title="Voir mon profil"
                                >
                                    {getUserInitials()}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors duration-300 w-full"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <Link
                                    to="/auth/login"
                                    className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition-colors duration-300 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
