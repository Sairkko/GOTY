// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = false; // Remplacez par la logique d'authentification
    return isLoggedIn ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
