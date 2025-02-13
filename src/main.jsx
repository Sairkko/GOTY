import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { UserProvider } from './contexts/UserContext.jsx';
import EmailConfirmation from "./pages/EmailConfirmation.jsx";
import Game from "./pages/Game.jsx";
import Profile from "./pages/Profile.jsx";
import AuthLayout from './components/AuthLayout.jsx';
import MainLayout from './components/MainLayout.jsx';
import App from "./App.jsx";

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <App />,
            },
            {
                path: '/game/:gameId',
                element: <Game />,
            },
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '/email-confirmation',
                element: <EmailConfirmation />,
            },
        ],
    },
    {
        path: '/auth/:mode', // Pas de navbar pour l'authentification
        element: <AuthLayout />,
    },
]);

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <DarkModeProvider>
                <RouterProvider router={router} />
            </DarkModeProvider>
        </UserProvider>
    </React.StrictMode>
);
