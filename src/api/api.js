import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Fonction pour enregistrer un utilisateur
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Fonction pour connecter un utilisateur
export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_URL}/login`, loginData);
    if (response.data.token) {
        // Stocker le token JWT dans le localStorage
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Fonction pour déconnecter un utilisateur
export const logoutUser = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/logout`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    return response.data;
};

// Fonction pour obtenir les utilisateurs
export const getUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
