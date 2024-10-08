import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import AuthLayout from './components/AuthLayout.jsx';
import App from './App.jsx';
import { DarkModeProvider } from './contexts/DarkModeContext';
import EmailConfirmation from "./pages/EmailConfirmation.jsx";
import {UserProvider} from "./contexts/UserContext.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/auth/:mode',
        element: <AuthLayout />,
    },
    {
        path: '/email-confirmation',
        element: <EmailConfirmation />,
    }
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
