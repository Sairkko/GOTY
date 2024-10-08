import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AuthLayout from './components/AuthLayout.jsx';
import App from './App.jsx';
import { DarkModeProvider } from './contexts/DarkModeContext'; // Import du DarkModeProvider

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />, // App contient Navbar et Outlet pour rendre les enfants
    },
    {
        path: '/auth/:mode',
        element: <AuthLayout />, // Layout de Login et Register
    },
]);

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <DarkModeProvider> {/* Ajout du DarkModeProvider ici */}
                <RouterProvider router={router} />
            </DarkModeProvider>
        </AuthProvider>
    </React.StrictMode>
);
