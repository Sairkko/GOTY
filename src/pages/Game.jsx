import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from "../contexts/UserContext.jsx";
import { DarkModeContext } from "../contexts/DarkModeContext.jsx";
import Confetti from 'react-confetti'; // Import de react-confetti

const Game = () => {
    const { gameId } = useParams(); // Récupération de l'ID de la partie depuis l'URL
    const { user } = useContext(UserContext);
    const { darkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();

    const [socket, setSocket] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [gameState, setGameState] = useState("waiting");
    const [board, setBoard] = useState([]);
    const [currentTurn, setCurrentTurn] = useState(null);
    const [players, setPlayers] = useState([]);
    const [message, setMessage] = useState("");
    // États pour le lancer de pièce
    const [coinTossResult, setCoinTossResult] = useState(null);
    const [coinTossAnimating, setCoinTossAnimating] = useState(false);
    const [coinTossDone, setCoinTossDone] = useState(false);

    // Lorsque le jeu se termine, faire défiler la page en haut
    useEffect(() => {
        if (gameState === "finished") {
            window.scrollTo(0, 0);
        }
    }, [gameState]);

    useEffect(() => {
        const newSocket = io('https://jdr-lotr-back.onrender.com');
        setSocket(newSocket);

        // Rejoindre la partie
        newSocket.emit('joinGame', { gameId, userId: user.user.id });

        // Comptage à rebours
        newSocket.on('gameCountdown', data => {
            setCountdown(data.countdown);
        });

        newSocket.on('gameStarted', data => {
            console.log("gameStarted reçu :", data);
            setGameState(data.state);
            setPlayers(data.players);
            setBoard(data.board);
            setCurrentTurn(data.currentTurn);
            setCountdown(null);
            setMessage("La partie a commencé !");

            // Pour tous les clients, activer l'animation du coin toss si non terminé
            if (!coinTossDone) {
                setCoinTossAnimating(true);
            }

            // Si je suis le créateur, lancer le tirage de pièce après 3 secondes
            if (!coinTossDone && data.players && data.players[0] === user.user.id) {
                setTimeout(() => {
                    const result = Math.random() < 0.5 ? "pile" : "face";
                    console.log("Créateur lance coin toss, résultat :", result);
                    setCoinTossResult(result);
                    setCoinTossAnimating(false);
                    setCoinTossDone(true);
                    // Déterminer le tour selon le résultat
                    const newTurn = result === "pile"
                        ? data.players[0]
                        : (data.players[1] ? data.players[1] : data.players[0]);
                    setCurrentTurn(newTurn);
                    console.log("Nouveau tour défini :", newTurn);
                    // Émettre le résultat pour synchroniser tous les clients
                    newSocket.emit("coinTossResult", { gameId, result, players: data.players });
                }, 3000);
            }
        });

        // Réception du résultat du lancer de pièce (pour tous les clients)
        newSocket.on('coinTossResult', data => {
            console.log("coinTossResult reçu :", data);
            setCoinTossResult(data.result);
            setCoinTossAnimating(false);
            setCoinTossDone(true);
            if (data.result === "pile") {
                setCurrentTurn(data.players[0]);
                console.log("Tour mis à jour (pile) :", data.players[0]);
            } else {
                if (data.players[1]) {
                    setCurrentTurn(data.players[1]);
                    console.log("Tour mis à jour (face) :", data.players[1]);
                } else {
                    setCurrentTurn(data.players[0]);
                    console.warn("players[1] non défini, on garde le créateur");
                }
            }
        });

        newSocket.on('moveMade', data => {
            setBoard(data.board);
            setCurrentTurn(data.currentTurn);
        });

        newSocket.on('gameOver', data => {
            setGameState("finished");
            setBoard(data.board);
            if (data.winner) {
                setMessage(`La partie est terminée. Le gagnant est ${data.winner}`);
            } else {
                setMessage("La partie a été terminée par le créateur.");
            }
        });

        newSocket.on('error', errorData => {
            setMessage(errorData.message);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [gameId, user]); // Retiré coinTossDone des dépendances

    // Lors du clic sur une colonne pour jouer un coup
    const handleColumnClick = (colIndex) => {
        if (gameState !== "playing") return;
        if (coinTossAnimating) return; // Ne rien faire pendant l'animation du coin toss
        if (currentTurn !== user.user.id) {
            setMessage("Ce n'est pas votre tour !");
            return;
        }
        socket.emit("makeMove", { gameId, userId: user.user.id, column: colIndex });
    };

    // Permet au créateur de terminer la partie
    const handleEndGame = () => {
        socket.emit("endGame", { gameId, userId: user.user.id });
    };

    // Rendu du plateau de jeu
    const renderBoard = () => {
        return (
            <div className="grid gap-2 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg shadow-lg">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-7 gap-2">
                        {row.map((cell, colIndex) => (
                            <div
                                key={colIndex}
                                onClick={() => handleColumnClick(colIndex)}
                                className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border border-gray-400 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                {cell === 1 ? (
                                    <span className="text-xl sm:text-2xl md:text-3xl">🔴</span>
                                ) : cell === 2 ? (
                                    <span className="text-xl sm:text-2xl md:text-3xl">🟡</span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    // Écran d'attente
    const renderWaitingScreen = () => {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center">
                    <svg
                        className="animate-spin h-10 w-10 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                </div>
                <p className="text-xl font-semibold text-gray-700 dark:text-white">
                    {countdown !== null
                        ? `La partie commence dans ${countdown}...`
                        : "En attente d'un autre joueur..."}
                </p>
            </div>
        );
    };

    // Affichage du lancer de pièce
    const renderCoinToss = () => {
        return (
            <div className="flex flex-col items-center mb-4">
                {coinTossAnimating ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span className="ml-2 text-lg font-semibold text-gray-700 dark:text-white">Lancement de la pièce...</span>
                    </div>
                ) : coinTossResult ? (
                    <p className="text-xl font-semibold text-gray-700 dark:text-white">
                        Résultat du lancer : {coinTossResult === "pile" ? "Pile" : "Face"}
                    </p>
                ) : null}
            </div>
        );
    };

    // Écran de jeu
    const renderGameScreen = () => {
        return (
            <div className="flex flex-col items-center max-w-full">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">Partie en cours</h2>
                {renderCoinToss()}
                {/* Afficher le message de tour seulement si le coin toss est terminé */}
                {coinTossDone && !coinTossAnimating && (
                    <div className="mb-4">
                        {currentTurn === user.user.id ? (
                            <p className="text-sm sm:text-base text-green-600 dark:text-green-400 font-semibold">C'est votre tour</p>
                        ) : (
                            <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-semibold">En attente du tour de l'autre joueur</p>
                        )}
                    </div>
                )}
                {renderBoard()}
                {players[0] === user.user.id && (
                    <button
                        onClick={handleEndGame}
                        className="mt-4 px-4 sm:px-6 py-2 bg-red-500 text-white text-sm sm:text-base rounded hover:bg-red-600 transition"
                    >
                        Terminer la partie
                    </button>
                )}
            </div>
        );
    };

    // Écran de fin de partie avec confettis
    const renderFinishedScreen = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return (
            <div className="flex flex-col items-center justify-start space-y-6 p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-2">
                {/* Composant Confetti */}
                <Confetti className="absolute top-0 left-0" width={width} height={height} recycle={false} numberOfPieces={500} />
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center">{message}</h2>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-sm sm:text-base rounded hover:bg-blue-600 transition"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    };

    return (
        <div className={`min-h-screen flex flex-col items-center ${gameState === "finished" ? "justify-start pt-8" : "justify-center"} bg-gray-100 dark:bg-gray-900 p-2 sm:p-4`}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-white">Partie {gameId}</h1>
            {gameState === "waiting" && renderWaitingScreen()}
            {gameState === "playing" && renderGameScreen()}
            {gameState === "finished" && renderFinishedScreen()}
        </div>
    );
};

export default Game;
