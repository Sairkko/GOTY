import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const { isLoggedIn, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.fromLogin) {
            toast.success('Connexion réussie !', {
                autoClose: 3000,
            });
            navigate('/', { replace: true, state: {} });
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen py-12 px-6 transition-all bg-gray-100 dark:bg-gray-900">
            <ToastContainer />

            <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                Bienvenue sur le jeu !
            </h1>

            {isLoggedIn && user ? (
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-8 transition-all">
                    <p className="text-xl font-semibold mb-4">
                        Vous êtes connecté en tant que :
                    </p>
                    <div className="space-y-4">
                        <p>
                            <span className="font-bold">Nom :</span> {user.name}
                        </p>
                        <p>
                            <span className="font-bold">Prénom :</span> {user.lastname}
                        </p>
                        <p>
                            <span className="font-bold">Pseudo :</span> {user.username}
                        </p>
                        <p>
                            <span className="font-bold">Email :</span> {user.email}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="max-w-lg mx-auto bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-6 rounded-lg shadow-md mt-8">
                    <p className="text-center font-semibold">
                        Veuillez vous connecter ou vous inscrire pour commencer.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
