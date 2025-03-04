"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Minus, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import confetti from "confetti"

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}


const penaltyPerFlip = 50
const initialScore = 100 * 2 * penaltyPerFlip
const emojis = ["😏", "😈", "🫦", "👅", "😘", "💋", "❤️", "🔥"]

export default function MemoryCardGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(initialScore)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const router = useRouter()

  // Initialize the game with all cards face down
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5)
    setCards(
      shuffledEmojis.map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    )
    setFlippedCards([])
    setGameOver(false)
    setScore(initialScore)
    setGameStarted(true)
  }

  const handleCardClick = useCallback(
    (id: number) => {
      // Don't allow clicks if game is over or two cards are already flipped
      if (gameOver) return
      if (flippedCards.length === 2) return
      
      // Don't allow clicking on already flipped or matched cards
      const clickedCard = cards[id]
      if (clickedCard.isFlipped || clickedCard.isMatched) return

      // Flip the card and add to flipped cards array
      setCards((prevCards) => 
        prevCards.map((card) => 
          card.id === id ? { ...card, isFlipped: true } : card
        )
      )
      
      // Add to flipped cards and reduce score
      setFlippedCards((prev) => [...prev, id])
      setScore((prevScore) => Math.max(0, prevScore - penaltyPerFlip))
    },
    [flippedCards, gameOver, cards]
  )

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards[first]
      const secondCard = cards[second]

      if (firstCard.emoji === secondCard.emoji) {
        // If cards match, mark them as matched
        setCards((prevCards) =>
          prevCards.map((card) => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true } 
              : card
          )
        )
        setFlippedCards([])
      } else {
        // If no match, flip them back after a delay
        const timer = setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) => 
              card.id === first || card.id === second 
                ? { ...card, isFlipped: false } 
                : card
            )
          )
          setFlippedCards([])
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [flippedCards, cards])

  // Check if game is over when cards change
  useEffect(() => {
    if (gameStarted && cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameOver(true)
      // confetti
    }
  }, [cards, gameStarted])

  const handleGameEnd = useCallback(() => {
    console.log("Final score:", score)
    router.push("/")
  }, [score, router])

  const handleRestart = () => {
    initializeGame()
  }

  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Juego de Memoria</span>
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
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">Puntuación: {score}</div>
            {gameOver && <div className="text-xl font-bold text-kawaii-pink-600">¡Juego terminado!</div>}
          </div>
          <div className="grid grid-cols-4 gap-4 bg-kawaii-pink-100 p-4 rounded-lg">
            {cards.map((card) => (
              <button
                key={card.id}
                className={`w-20 h-20 flex items-center justify-center text-3xl rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 ${
                  card.isFlipped || card.isMatched ? "bg-white" : "bg-gray-400"
                }`}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || gameOver || (flippedCards.length === 2 && !card.isFlipped)}
              >
                {card.isFlipped || card.isMatched ? card.emoji : "?"}
              </button>
            ))}
          </div>
          {gameOver && (
            <div className="mt-4 text-center">
              <p className="text-xl mb-2">¡Felicidades! Tu puntuación final es: {score}</p>
              <div className="flex justify-center gap-4">
                <button className="pixel-button" onClick={handleRestart}>
                  Jugar de nuevo
                </button>
                <button className="pixel-button" onClick={handleGameEnd}>
                  Volver a los cupones
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

