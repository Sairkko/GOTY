// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    // Pour l'instant, utilisez une variable booléenne pour simuler la connexion
    const isLoggedIn = false; // Vous remplacerez ceci par votre logique d'authentification

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">Jeu</Link>
                <div>
                    {isLoggedIn ? (
                        <>
                            <button className="text-white px-4">Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white px-4">Connexion</Link>
                            <Link to="/register" className="text-white px-4">Inscription</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
