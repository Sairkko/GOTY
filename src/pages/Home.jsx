import React, { useContext, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { UserContext } from "../contexts/UserContext.jsx";
import { DarkModeContext } from "../contexts/DarkModeContext.jsx";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

const Home = () => {
    const { darkMode } = useContext(DarkModeContext);
    const { isLoggedIn, user } = useContext(UserContext);
    const [games, setGames] = useState([]);
    const [scoreboard, setScoreboard] = useState([]);
    const [showScoresModal, setShowScoresModal] = useState(false);
    const [show1v1Only, setShow1v1Only] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [gamesData, setGamesData] = useState([]);
    const [showUserHistory, setShowUserHistory] = useState(false);
    const [userHistory, setUserHistory] = useState([]);
    const navigate = useNavigate();
    const socket = io('https://jdr-lotr-back.onrender.com');

    // Fonction pour obtenir les initiales de l'utilisateur
    const getUserInitials = () => {
        if (!user || !user.user) return '';
        const username = user.user.username || '';
        return username.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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

    // Fonction pour récupérer les parties
    const fetchUserGames = async () => {
        try {
            const response = await axios.get('https://jdr-lotr-back.onrender.com/games', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.status === 200) {
                setGames(response.data);
            } else {
                toast.error("Erreur lors de la récupération des parties.");
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors de la récupération des parties.");
            console.error("Erreur:", error);
        }
    };

    // Fonction pour charger les données initiales
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [usersResponse, gamesResponse] = await Promise.all([
                axios.get('https://jdr-lotr-back.onrender.com/users', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }),
                axios.get('https://jdr-lotr-back.onrender.com/games', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
            ]);

            if (usersResponse.status === 200 && gamesResponse.status === 200) {
                setUsersData(usersResponse.data);
                setGamesData(gamesResponse.data);
                updateScoreboard(usersResponse.data, gamesResponse.data);
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération des données.");
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour mettre à jour le scoreboard
    const updateScoreboard = (users, games) => {
        // On ne prend en compte que les parties terminées ET qui ont un gagnant
        let finishedGames = games.filter(
            game => game.state === 'finished' && game.winner
        );

        if (show1v1Only) {
            // Pour les parties 1v1, on garde les parties avec un creator et un player
            finishedGames = finishedGames.filter(game => game.player !== null);
            // Créer un tableau des matchs 1v1 avec les détails
            const matchDetails = finishedGames.map(game => {
                const creator = users.find(u => u.id === game.creator);
                const opponent = users.find(u => u.id === game.player);
                const winner = users.find(u => u.id === game.winner);
                const creatorWon = game.winner === game.creator;
                
                return {
                    id: game.id,
                    creator: creator ? creator.username : 'Inconnu',
                    opponent: opponent ? opponent.username : 'Inconnu',
                    winner: winner ? winner.username : 'Inconnu',
                    score: creatorWon ? '1-0' : '0-1',
                    creatorWon
                };
            });
            setScoreboard(matchDetails);
        } else {
            // Code existant pour les stats globales
            const scoreboardData = users.map(u => {
                const played = finishedGames.filter(
                    g => g.creator === u.id || g.player === u.id
                ).length;
                const won = finishedGames.filter(
                    g => g.winner === u.id
                ).length;
                const winRate = played > 0 ? Math.round((won / played) * 100) : 0;
                return {
                    username: u.username,
                    played,
                    won,
                    winRate
                };
            }).filter(user => user.played > 0);
            setScoreboard(scoreboardData);
        }
    };

    // Effet pour charger les données initiales quand la modale s'ouvre
    useEffect(() => {
        if (showScoresModal) {
            fetchInitialData();
        }
    }, [showScoresModal]);

    // Effet pour mettre à jour le scoreboard quand on change de mode
    useEffect(() => {
        if (usersData.length > 0 && gamesData.length > 0) {
            setIsLoading(true);
            setTimeout(() => {
                updateScoreboard(usersData, gamesData);
                setIsLoading(false);
            }, 100);
        }
    }, [show1v1Only, usersData, gamesData]);

    useEffect(() => {
        if (isLoggedIn && user && user.token) {
            fetchUserGames();
        }
        return () => {
            socket.disconnect();
        };
    }, [isLoggedIn, user]);

    useEffect(() => {
        if (showUserHistory && isLoggedIn) {
            fetchUserHistory();
        }
    }, [showUserHistory]);

    const createGame = async () => {
        if (!isLoggedIn) {
            toast.error("Veuillez vous connecter pour créer une partie");
            return;
        }
        try {
            const response = await axios.post(
                'https://jdr-lotr-back.onrender.com/game',
                { userId: user.user.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            );
            if (response.status === 200) {
                const data = response.data;
                // Émission de l'événement via Socket.io pour créer la partie
                socket.emit("createGame", { gameId: data.gameId, userId: user.user.id });
                socket.on("gameCreated", (gameData) => {
                    toast.success("Partie créée avec succès !");
                    fetchUserGames();  // Met à jour la liste des parties
                    navigate(`/game/${data.gameId}`);
                });
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors de la création de la partie");
            console.error("Erreur:", error);
        }
    };

    const joinGame = async (gameId, userId) => {
        try {
            await axios.patch(`https://jdr-lotr-back.onrender.com/game/start/${gameId}`, { userId }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            // Naviguer vers la partie et notifier le serveur via Socket.io
            navigate(`/game/${gameId}`);
            socket.emit("joinGame", { gameId, userId });
        } catch (error) {
            toast.error("Erreur lors de la tentative de rejoindre la partie.");
            console.error(error);
        }
    };

    // Fonction utilitaire pour déterminer le libellé, la fonction onClick, l'état disabled et la couleur du bouton
    const getButtonProps = (game) => {
        if (game.state === "pending") {
            return {
                label: "Rejoindre la partie",
                onClick: () => joinGame(game.id, user.user.id),
                disabled: false,
                color: "green", // Bouton actif, couleur verte (ou toute autre couleur de votre choix)
            };
        } else if (game.state === "playing" || game.state === "finished") {
            return {
                label: "Partie terminer",
                onClick: () => {},
                disabled: true,
                color: "red",
            };
        }
    };

    const joinableGames = games.filter(game =>
        game.creator !== user.user.id && game.state === "pending"
    );
    const finishedGames = games.filter(game =>
        game.state === "finished"
    );

    return (
        <div className="min-h-screen py-12 px-6 transition-all bg-gray-100 dark:bg-gray-900">
            <ToastContainer theme={darkMode ? "dark" : "light"} />

            <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                Bienvenue sur Puissance 4 !
            </h1>

            {isLoggedIn ? (
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-8 transition-all">
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-all"
                            onClick={createGame}
                        >
                            Créer une partie
                        </button>
                        <button
                            className="bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-all"
                            onClick={() => {
                                fetchInitialData();
                                setShowScoresModal(true);
                            }}
                        >
                            Afficher les scores
                        </button>
                    </div>

                    {/* Section Parties joignables */}
                    {joinableGames.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Parties joignables</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {joinableGames.map((game) => {
                                    const btnProps = getButtonProps(game);
                                    return (
                                        <div key={game.id} className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                                            <h2 className="text-2xl font-bold mb-2">
                                                {game.state === 'pending' ? "Partie disponible" : "En cours"}
                                            </h2>
                                            <p className="mb-4">
                                                <strong>ID de la partie :</strong> {game.id}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Créateur :</strong> {game.creator}
                                            </p>
                                            <button
                                                onClick={btnProps.onClick}
                                                disabled={btnProps.disabled}
                                                className={`text-white font-bold py-2 px-4 rounded transition-all ${btnProps.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-green-700"}`}
                                                style={{ backgroundColor: btnProps.color }}
                                            >
                                                {btnProps.label}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Section Parties terminées */}
                    {finishedGames.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Parties terminées</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {finishedGames.map((game) => {
                                    const btnProps = getButtonProps(game);
                                    return (
                                        <div key={game.id} className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                                            <h2 className="text-2xl font-bold mb-2">Terminée</h2>
                                            <p className="mb-4">
                                                <strong>ID de la partie :</strong> {game.id}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Créateur :</strong> {game.creator}
                                            </p>
                                            <button
                                                onClick={btnProps.onClick}
                                                disabled={btnProps.disabled}
                                                className={`text-white font-bold py-2 px-4 rounded transition-all ${btnProps.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-green-700"}`}
                                                style={{ backgroundColor: btnProps.color }}
                                            >
                                                {btnProps.label}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {games.length === 0 && (
                        <p className="mt-8 text-center text-gray-700 dark:text-gray-300">
                            Aucune partie pour le moment.
                        </p>
                    )}
                </div>
            ) : (
                <div className="max-w-lg mx-auto bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-6 rounded-lg shadow-md mt-8">
                    <p className="text-center font-semibold">
                        Veuillez vous connecter ou vous inscrire pour commencer.
                    </p>
                </div>
            )}

            {/* Modale du scoreboard */}
            {showScoresModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                        <button
                            className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={() => setShowScoresModal(false)}
                        >
                            Fermer
                        </button>

                        <div className="flex flex-col space-y-6 mt-8">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Scoreboard</h2>
                                <div className="flex space-x-2 sm:space-x-4">
                                    <button
                                        onClick={() => setShow1v1Only(false)}
                                        className={`px-3 sm:px-4 py-2 rounded transition-all text-sm sm:text-base ${
                                            !show1v1Only 
                                            ? 'bg-blue-500 text-white shadow-lg' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        Tous les scores
                                    </button>
                                    <button
                                        onClick={() => setShow1v1Only(true)}
                                        className={`px-3 sm:px-4 py-2 rounded transition-all text-sm sm:text-base ${
                                            show1v1Only 
                                            ? 'bg-blue-500 text-white shadow-lg' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        Scores 1v1
                                    </button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                scoreboard.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800">
                                            <tr>
                                                {show1v1Only ? (
                                                    <>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Joueur 1</th>
                                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">Score</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Joueur 2</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Gagnant</th>
                                                    </>
                                                ) : (
                                                    <>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Nom</th>
                                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">Parties jouées</th>
                                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">Parties gagnées</th>
                                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">% Victoire</th>
                                                    </>
                                                )}
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {show1v1Only ? (
                                                scoreboard.map((match, index) => (
                                                    <tr key={match.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200`}>
                                                        <td className={`px-6 py-4 text-sm ${match.creatorWon ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {match.creator}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                                                            {match.score}
                                                        </td>
                                                        <td className={`px-6 py-4 text-sm ${!match.creatorWon ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {match.opponent}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                                                            {match.winner}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                scoreboard.map((userScore, index) => (
                                                    <tr key={userScore.username} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200`}>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {userScore.username}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center font-mono text-gray-700 dark:text-gray-300">
                                                            {userScore.played}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center font-mono text-gray-700 dark:text-gray-300">
                                                            {userScore.won}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                                userScore.winRate >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                                userScore.winRate >= 40 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            }`}>
                                                                {userScore.winRate}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        {show1v1Only ? "Aucune partie 1v1 trouvée." : "Aucun score disponible."}
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pour l'historique personnel */}
            {showUserHistory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Mon Historique de Parties
                            </h2>
                            <button
                                onClick={() => setShowUserHistory(false)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Fermer
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Statistiques */}
                                {userHistory.stats && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {userHistory.stats.total}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Parties totales
                                            </div>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {userHistory.stats.won}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Victoires
                                            </div>
                                        </div>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                                {userHistory.stats.pending}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                En attente
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {userHistory.stats.playing}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                En cours
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tableau des parties */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Adversaire</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">Statut</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">Résultat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {userHistory.games && userHistory.games.map((game, index) => (
                                                <tr key={game.id} className={`${
                                                    index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                                                } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200`}>
                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                        {new Date(game.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                        {game.player ? (
                                                            game.creator === user.user.id ? game.player : game.creator
                                                        ) : 'En attente'}
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
                                                        {game.state === 'finished' ? (
                                                            game.winner === user.user.id ? (
                                                                <span className="text-green-600 dark:text-green-400">Victoire</span>
                                                            ) : (
                                                                <span className="text-red-600 dark:text-red-400">Défaite</span>
                                                            )
                                                        ) : (
                                                            <span className="text-gray-500 dark:text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
