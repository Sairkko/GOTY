import React from 'react';
import { DarkModeProvider } from './contexts/DarkModeContext'; // Importer le DarkModeProvider
import Navbar from './pages/Navbar';
import Home from './pages/Home';

function App() {
    return (
        <DarkModeProvider>
            <Navbar />
            <Home />
        </DarkModeProvider>
    );
}

export default App;
