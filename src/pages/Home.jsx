import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Home = () => {
    const { isLoggedIn, user } = useContext(AuthContext);

    return (
        <div className="container mx-auto py-12 px-6">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
                Bienvenue sur le jeu !
            </h1>
            {isLoggedIn && user ? (
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <p className="text-xl font-semibold text-gray-700 mb-4">
                        Vous êtes connecté en tant que :
                    </p>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            <span className="font-bold text-gray-800">Nom :</span> {user.name}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold text-gray-800">Prénom :</span> {user.lastname}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold text-gray-800">Pseudo :</span> {user.username}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold text-gray-800">Email :</span> {user.email}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="max-w-lg mx-auto bg-red-100 text-red-600 p-6 rounded-lg shadow-md mt-8">
                    <p className="text-center font-semibold">
                        Veuillez vous connecter ou vous inscrire pour commencer.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
