"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Minus, Square } from "lucide-react"

interface Emoji {
  id: number
  type: "😘" | "💋" | "❤️" | "🫢" | "👻" | "💝"
  x: number
  y: number
}

export default function KissGameScreen() {
  const [score, setScore] = useState(0)
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const [gameOver, setGameOver] = useState(false)

  const spawnEmoji = useCallback(() => {
    const emojiTypes = ["😘", "💋", "❤️", "🫢", "👻", "💝"] as const
    const weights = [0.3, 0.3, 0.2, 0.1, 0.05, 0.05]
    let random = Math.random()
    const type = emojiTypes[weights.findIndex((weight, i) => (random -= weight) < 0)]

    setEmojis((prevEmojis) => [
      ...prevEmojis,
      {
        id: Date.now(),
        type,
        x: Math.random() * 80 + 10, // 10% to 90% of the screen width
        y: Math.random() * 80 + 10, // 10% to 90% of the screen height
      },
    ])
  }, [])

  const removeEmoji = useCallback((id: number) => {
    setEmojis((prevEmojis) => prevEmojis.filter((emoji) => emoji.id !== id))
  }, [])

  const handleClick = useCallback(
    (emoji: Emoji) => {
      removeEmoji(emoji.id)
      switch (emoji.type) {
        case "😘":
          setScore((prevScore) => prevScore + 100)
          break
        case "💋":
          setScore((prevScore) => prevScore + 200)
          break
        case "❤️":
          setScore((prevScore) => prevScore + 300)
          break
        case "🫢":
          setScore((prevScore) => prevScore - 100)
          break
        case "👻":
          setScore((prevScore) => prevScore - 200)
          break
        case "💝":
          setScore((prevScore) => prevScore + 1000)
          break
      }
    },
    [removeEmoji],
  )

  useEffect(() => {
    const spawnInterval = setInterval(spawnEmoji, 1000)
    const gameTimer = setTimeout(() => setGameOver(true), 60000) // 60 seconds game

    return () => {
      clearInterval(spawnInterval)
      clearTimeout(gameTimer)
    }
  }, [spawnEmoji])

  useEffect(() => {
    emojis.forEach((emoji) => {
      const timer = setTimeout(() => removeEmoji(emoji.id), 3000) // Emojis disappear after 3 seconds
      return () => clearTimeout(timer)
    })
  }, [emojis, removeEmoji])

  return (
    <div className="w-full max-w-2xl relative z-10">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Juego de Besos</span>
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
          <div className="relative w-full h-[400px] bg-kawaii-pink-100 rounded-lg overflow-hidden">
            {emojis.map((emoji) => (
              <button
                key={emoji.id}
                className="absolute text-4xl transition-all duration-300 ease-in-out transform hover:scale-110"
                style={{ left: `${emoji.x}%`, top: `${emoji.y}%` }}
                onClick={() => handleClick(emoji)}
                disabled={gameOver}
              >
                {emoji.type}
              </button>
            ))}
          </div>
          {gameOver && (
            <div className="mt-4 text-center">
              <p className="text-xl mb-2">¡Felicidades! Tu puntuación final es: {score}</p>
              <button className="pixel-button" onClick={() => window.location.reload()}>
                Jugar de nuevo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

