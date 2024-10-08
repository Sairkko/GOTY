import React from 'react';
import { Link } from 'react-router-dom';

const EmailConfirmation = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Inscription réussie
                </h1>
                <p className="text-center text-lg mb-6">
                    Veuillez vérifier votre adresse e-mail pour activer votre compte.
                </p>
                <p className="text-center text-lg">
                    Une fois que vous avez activé votre compte, vous pouvez vous connecter.
                </p>
                <div className="mt-6 text-center">
                    <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Aller à la page de connexion
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
