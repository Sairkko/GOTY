import React from 'react';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import {UserProvider} from "./contexts/UserContext.jsx";

function App() {
    return (
        <div>
                <Navbar />
                <Home />
        </div>
    );
}

export default App;
