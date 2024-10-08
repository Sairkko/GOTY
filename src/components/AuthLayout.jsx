import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import logo from '../assets/img.png';

const AuthLayout = () => {
    const { mode } = useParams();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-all">
            <div className="container max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 transition-all m-8">
                <div className="flex justify-center mb-8">
                    <img src={logo} alt="Logo" className="w-24 h-20"/>
                </div>
                <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    {mode === 'login' ? 'Connexion' : 'Inscription'}
                </h1>
                {mode === 'login' ? <Login /> : <Register />}

                <div className="mt-6 text-center">
                    {mode === 'login' ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Pas de compte ?{" "}
                            <Link to="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Inscrivez-vous ici
                            </Link>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Déjà inscrit ?{" "}
                            <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Connectez-vous ici
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
