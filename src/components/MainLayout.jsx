import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
            <Navbar />
            <div className="container mx-auto p-4">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
