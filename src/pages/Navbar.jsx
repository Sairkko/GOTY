import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import logo from "../assets/img.png";

const Navbar = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    return (
        <nav className="p-4 bg-white dark:bg-gray-700 shadow-md transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-24 h-20" />

                <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
                    Jeu
                </Link>

                <div className="flex items-center">
                    <button
                        onClick={toggleDarkMode}
                        className="px-4 py-2 rounded-lg flex items-center transition-colors duration-300 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                        {darkMode ? (
                            <SunIcon className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <MoonIcon className="w-5 h-5 text-white" />
                        )}
                    </button>

                    <Link
                        to="/auth/login"
                        className="ml-4 text-gray-900 dark:text-white transition-colors duration-300 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        Connexion
                    </Link>

                    <Link
                        to="/auth/register"
                        className="ml-4 text-gray-900 dark:text-white transition-colors duration-300 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        Inscription
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
