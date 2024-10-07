import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AuthLayout = () => {
    const { mode } = useParams();

    return (
        <div className="container mx-auto max-w-md mt-10 bg-white shadow-lg rounded-lg p-8 m-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                {mode === 'login' ? 'Connexion' : 'Inscription'}
            </h1>
            {mode === 'login' ? <Login /> : <Register />}

            <div className="mt-6 text-center">
                {mode === 'login' ? (
                    <p className="text-sm text-gray-600">
                        Pas de compte ?{" "}
                        <Link to="/auth/register" className="text-blue-600 hover:underline">
                            Inscrivez-vous ici
                        </Link>
                    </p>
                ) : (
                    <p className="text-sm text-gray-600">
                        Déjà inscrit ?{" "}
                        <Link to="/auth/login" className="text-blue-600 hover:underline">
                            Connectez-vous ici
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthLayout;
