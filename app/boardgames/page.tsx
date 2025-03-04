"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Minus, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import confetti from "confetti"

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
]

const MAX_TRIES = 7
const WORDS_TO_GUESS = 3

interface GameState {
  wordsToGuess: string[]
  currentWordIndex: number
  guessedLetters: Set<string>
  remainingTries: number
  gameOver: boolean
  gameWon: boolean
}

export default function BoardGamesPage() {
  const [gameState, setGameState] = useState<GameState>({
    wordsToGuess: [],
    currentWordIndex: 0,
    guessedLetters: new Set(),
    remainingTries: MAX_TRIES,
    gameOver: false,
    gameWon: false,
  })
  const router = useRouter()

  const initializeGame = useCallback(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, WORDS_TO_GUESS)
    setGameState({
      wordsToGuess: selected,
      currentWordIndex: 0,
      guessedLetters: new Set(),
      remainingTries: MAX_TRIES,
      gameOver: false,
      gameWon: false,
    })
  }, [])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const getCurrentWord = () => gameState.wordsToGuess[gameState.currentWordIndex] || ""

  const getMaskedWord = () => {
    const currentWord = getCurrentWord()
    return currentWord
      ? currentWord
          .split("")
          .map((letter) => (gameState.guessedLetters.has(letter.toLowerCase()) ? letter : "_"))
          .join(" ")
      : ""
  }

  const handleGuess = (letter: string) => {
    const currentWord = getCurrentWord()
    if (!currentWord) return

    const lowerLetter = letter.toLowerCase()
    if (gameState.guessedLetters.has(lowerLetter)) return

    const newGuessedLetters = new Set(gameState.guessedLetters).add(lowerLetter)
    const currentWordLower = currentWord.toLowerCase()
    const isCorrectGuess = currentWordLower.includes(lowerLetter)
    const newRemainingTries = isCorrectGuess ? gameState.remainingTries : gameState.remainingTries - 1
    const isWordComplete = currentWordLower.split("").every((l) => newGuessedLetters.has(l))

    let newGameState: Partial<GameState> = {
      guessedLetters: newGuessedLetters,
      remainingTries: newRemainingTries,
    }

    if (isWordComplete) {
      if (gameState.currentWordIndex === WORDS_TO_GUESS - 1) {
        newGameState = {
          ...newGameState,
          gameOver: true,
          gameWon: true,
        }
        // confetti
      } else {
        newGameState = {
          ...newGameState,
          currentWordIndex: gameState.currentWordIndex + 1,
          guessedLetters: new Set(),
          remainingTries: MAX_TRIES,
        }
      }
    } else if (newRemainingTries === 0) {
      newGameState = {
        ...newGameState,
        gameOver: true,
      }
    }

    setGameState((prevState) => ({ ...prevState, ...newGameState }))
  }

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.match(/^[a-zA-Z]$/)) {
        handleGuess(event.key)
      }
    },
    [handleGuess],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

  const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("")

  const handleGameEnd = () => {
    router.push("/")
  }

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
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">
              Palabra {gameState.currentWordIndex + 1} de {WORDS_TO_GUESS}
            </h2>
            <p className="text-4xl font-mono mb-6">{getMaskedWord()}</p>
            <p className="mb-4">Intentos restantes: {gameState.remainingTries}</p>
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
                  disabled={gameState.guessedLetters.has(letter.toLowerCase()) || gameState.gameOver}
                >
                  {letter}
                </button>
              ))}
            </div>
            {gameState.gameOver && (
              <div className="text-center">
                <p className="text-2xl font-bold mb-4">
                  {gameState.gameWon
                    ? "¡Felicidades! Has adivinado todas las palabras."
                    : `Juego terminado. La palabra era: ${getCurrentWord()}`}
                </p>
                <button className="pixel-button" onClick={handleGameEnd}>
                  Volver a los cupones
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

