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
    const navigate = useNavigate();
    const socket = io('http://0.0.0.0:10000');

    // Récupération de toutes les parties
    const fetchUserGames = async () => {
        try {
            const response = await axios.get('http://0.0.0.0:10000/games', {
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

    // Calcul du scoreboard (inchangé)
    // Calcul du scoreboard modifié pour ne prendre en compte que les parties terminées et avec un winner
    const fetchScoreboard = async () => {
        try {
            const usersResponse = await axios.get('http://0.0.0.0:10000:3000/users', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const gamesResponse = await axios.get('http://0.0.0.0:10000/games', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (usersResponse.status === 200 && gamesResponse.status === 200) {
                const users = usersResponse.data;
                // On ne prend en compte que les parties terminées ET qui ont un gagnant
                const finishedGames = gamesResponse.data.filter(
                    game => game.state === 'finished' && game.winner
                );
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
                });
                setScoreboard(scoreboardData);
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération du scoreboard.");
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn && user && user.token) {
            fetchUserGames();
        }
        return () => {
            socket.disconnect();
        };
    }, [isLoggedIn, user]);

    const createGame = async () => {
        if (!isLoggedIn) {
            toast.error("Veuillez vous connecter pour créer une partie");
            return;
        }
        try {
            const response = await axios.post(
                'http://0.0.0.0:10000/game',
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
            await axios.patch(`http://0.0.0.0:10000/game/start/${gameId}`, { userId }, {
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
                                fetchScoreboard();
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Scoreboard</h2>
                        {scoreboard.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Nom</th>
                                    <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Parties jouées</th>
                                    <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Parties gagnées</th>
                                    <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Pourcentage de victoire</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                                {scoreboard.map((userScore) => (
                                    <tr key={userScore.username}>
                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{userScore.username}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{userScore.played}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{userScore.won}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{userScore.winRate}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">Aucun score disponible.</p>
                        )}
                        <button
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            onClick={() => setShowScoresModal(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
