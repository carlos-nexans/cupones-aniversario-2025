"use client";

import { Minus, Square, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import GameWinFooter from "@/components/game-win-footer"
import GameLoseFooter from "@/components/game-loose-footer"

const words = [
  "Amor",
  "Ternura",
  "Cariños",
  "Comprension",
  "Compañia",
  "Pasion",
  "Dulzura",
  "Afecto",
  "Romance",
  "Corazon",
  "Besos",
  "Abrazos",
  "Fidelidad",
  "Confianza",
  "Respeto",
  "Admiracion",
  "Lealtad",
  "Complicidad",
  "Intimidad",
  "Devocion",
  "Entrega",
  "Felicidad",
  "Armonia",
  "Empatia",
  "Caricias",
  "Enamoramiento",
  "Adoracion",
  "Seduccion",
  "Atraccion",
  "Compromiso",
];

const MAX_TRIES = 7;
const WORDS_TO_GUESS = 3;
const POINTS_PER_WORD = 1000;
const POINTS_LOST_PER_TRY = 100;

interface GameState {
  wordsToGuess: string[];
  currentWordIndex: number;
  guessedLetters: Set<string>;
  remainingTries: number;
  gameOver: boolean;
  gameWon: boolean;
  score: number;
  gameStarted: boolean;
}

export default function BoardGamesPage() {
  const [gameState, setGameState] = useState<GameState>({
    wordsToGuess: [],
    currentWordIndex: 0,
    guessedLetters: new Set(),
    remainingTries: MAX_TRIES,
    gameOver: false,
    gameWon: false,
    score: 0,
    gameStarted: false,
  });
  const router = useRouter();

  const playClickSound = useCallback(() => {
    if (typeof Audio !== 'undefined') {
      const sound = new Audio('/sounds/click-good.wav')
      sound.play()
    }
  }, []);

  const initializeGame = useCallback(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, WORDS_TO_GUESS);
    setGameState({
      wordsToGuess: selected,
      currentWordIndex: 0,
      guessedLetters: new Set(),
      remainingTries: MAX_TRIES,
      gameOver: false,
      gameWon: false,
      score: 0,
      gameStarted: true,
    });
  }, []);

  const getCurrentWord = () =>
    gameState.wordsToGuess[gameState.currentWordIndex] || "";

  const getMaskedWord = () => {
    const currentWord = getCurrentWord();
    return currentWord
      ? currentWord
          .split("")
          .map((letter) =>
            gameState.guessedLetters.has(letter.toLowerCase()) ? letter : "_"
          )
          .join(" ")
      : "";
  };

  const handleGuess = (letter: string) => {
    const currentWord = getCurrentWord();
    if (!currentWord) return;

    const lowerLetter = letter.toLowerCase();
    if (gameState.guessedLetters.has(lowerLetter)) return;

    playClickSound();

    const newGuessedLetters = new Set(gameState.guessedLetters).add(
      lowerLetter
    );
    const currentWordLower = currentWord.toLowerCase();
    const isCorrectGuess = currentWordLower.includes(lowerLetter);
    const newRemainingTries = isCorrectGuess
      ? gameState.remainingTries
      : gameState.remainingTries - 1;
    const isWordComplete = currentWordLower
      .split("")
      .every((l) => newGuessedLetters.has(l));

    let newGameState: Partial<GameState> = {
      guessedLetters: newGuessedLetters,
      remainingTries: newRemainingTries,
    };

    if (isWordComplete) {
      const newScore = gameState.score + POINTS_PER_WORD - (MAX_TRIES - newRemainingTries) * POINTS_LOST_PER_TRY;
      if (gameState.currentWordIndex === WORDS_TO_GUESS - 1) {
        newGameState = {
          ...newGameState,
          gameOver: true,
          gameWon: true,
          score: newScore,
        };
      } else {
        newGameState = {
          ...newGameState,
          currentWordIndex: gameState.currentWordIndex + 1,
          guessedLetters: new Set(),
          remainingTries: MAX_TRIES,
          score: newScore,
        };
      }
    } else if (newRemainingTries === 0) {
      newGameState = {
        ...newGameState,
        gameOver: true,
        score: gameState.score - (MAX_TRIES - newRemainingTries) * POINTS_LOST_PER_TRY,
      };
    }

    setGameState((prevState) => ({ ...prevState, ...newGameState }));
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.match(/^[a-zA-Z]$/)) {
        handleGuess(event.key);
      }
    },
    [handleGuess]
  );

  useEffect(() => {
    if (!gameState.gameStarted) return;
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress, gameState.gameStarted]);

  const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Juego del Ahorcado</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-white/10 rounded">
              <Minus size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded">
              <Square size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded">
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="retro-window-content">
          {!gameState.gameStarted ? (
            <div className="relative w-full h-[400px] bg-kawaii-blue-100 rounded-lg overflow-hidden flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 special-text">¡Adivina las palabras del amor!</h2>
              <button
                onClick={initializeGame}
                className="pixel-button"
              >
                Empezar
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">
                  Palabra {gameState.currentWordIndex + 1} de {WORDS_TO_GUESS}
                </h2>
                <p className="text-4xl font-mono mb-6">{getMaskedWord()}</p>
                <p className="mb-4">
                  Intentos restantes: {gameState.remainingTries}
                </p>
                <div className="grid grid-cols-9 gap-2 mb-6">
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      className={`w-8 h-8 rounded ${
                        gameState.guessedLetters.has(letter.toLowerCase())
                          ? "bg-gray-300 text-gray-500"
                          : "bg-kawaii-blue-600 text-white hover:bg-kawaii-blue-700"
                      } font-bold`}
                      onClick={() => handleGuess(letter)}
                      disabled={
                        gameState.guessedLetters.has(letter.toLowerCase()) ||
                        gameState.gameOver
                      }
                    >
                      {letter}
                    </button>
                  ))}
                </div>
                {gameState.gameOver && gameState.gameWon && (
                  <GameWinFooter score={gameState.score} />
                )}
                {gameState.gameOver && !gameState.gameWon && (
                  <>
                    <p className="text-xl font-bold text-red-600 mb-4">
                      La palabra era: {getCurrentWord()}
                    </p>
                    <GameLoseFooter onRestart={initializeGame} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
