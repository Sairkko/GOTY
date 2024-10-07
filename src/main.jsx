import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AuthLayout from './components/AuthLayout.jsx';
import App from "./App.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/auth/:mode',
        element: <AuthLayout />,
    },
]);

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);
