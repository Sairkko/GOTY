import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contexts/UserContext.jsx";
import { DarkModeContext } from "../contexts/DarkModeContext.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user } = useContext(UserContext);
    const { darkMode } = useContext(DarkModeContext);
    const [userHistory, setUserHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [usersData, setUsersData] = useState({});

    // Fonction pour récupérer les données des utilisateurs
    const fetchUsersData = async () => {
        try {
            const response = await axios.get('https://jdr-lotr-back.onrender.com/users', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            
            if (response.status === 200) {
                const usersMap = {};
                response.data.forEach(user => {
                    usersMap[user.id] = user;
                });
                setUsersData(usersMap);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
        }
    };

    // Fonction pour récupérer l'historique des parties de l'utilisateur
    const fetchUserHistory = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://jdr-lotr-back.onrender.com/games', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            
            if (response.status === 200) {
                // Filtrer les parties où l'utilisateur est impliqué
                const userGames = response.data.filter(game => 
                    game.creator === user.user.id || game.player === user.user.id
                );
                
                // Calculer les statistiques
                const stats = {
                    total: userGames.length,
                    won: userGames.filter(game => game.winner === user.user.id).length,
                    pending: userGames.filter(game => game.state === 'pending').length,
                    playing: userGames.filter(game => game.state === 'playing').length
                };
                
                setUserHistory({ games: userGames, stats });
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération de l'historique.");
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchUsersData();
            fetchUserHistory();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen py-12 px-6 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-lg mx-auto bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-6 rounded-lg shadow-md">
                    <p className="text-center font-semibold">
                        Veuillez vous connecter pour accéder à votre profil.
                    </p>
                </div>
            </div>
        );
    }

    const currentUserData = usersData[user.user.id] || {};

    return (
        <div className="min-h-screen py-12 px-6 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
                {/* Section Informations utilisateur */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                            {user.user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {user.user.username}
                            </h1>
                            <div className="space-y-2">
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold">Nom:</span> {currentUserData.lastname}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold">Prénom:</span> {currentUserData.firstname}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold">Email:</span> {currentUserData.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Statistiques et Historique */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : userHistory && (
                    <>
                        {/* Statistiques */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {userHistory.stats.total}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Parties totales
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {userHistory.stats.won}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Victoires
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {userHistory.stats.pending}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    En attente
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {userHistory.stats.playing}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    En cours
                                </div>
                            </div>
                        </div>

                        {/* Historique des parties */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <h2 className="text-xl font-bold p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                Historique des parties
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Adversaire</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Statut</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Résultat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {userHistory.games.map((game, index) => {
                                            const opponentId = game.creator === user.user.id ? game.player : game.creator;
                                            const opponent = usersData[opponentId];
                                            return (
                                                <tr key={game.id} className={`${
                                                    index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                                                } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200`}>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                                                        {new Date(game.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                                                        {opponent ? opponent.username : 'En attente'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            game.state === 'finished' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                            game.state === 'playing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                        }`}>
                                                            {game.state === 'finished' ? 'Terminée' :
                                                             game.state === 'playing' ? 'En cours' : 'En attente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center font-medium">
                                                        {game.state === 'finished' && game.winner === user.user.id ? (
                                                            <span className="text-green-600 dark:text-green-400">Victoire</span>
                                                        ) : (
                                                            <span className="text-red-600 dark:text-red-400">Défaite</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile; 