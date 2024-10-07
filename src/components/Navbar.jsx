import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">Jeu</Link>
                <div>
                    {isLoggedIn ? (
                        <>
                            <button onClick={logout} className="text-white px-4">Déconnexion</button>
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
};

export default Navbar;
