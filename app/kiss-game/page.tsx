"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Minus, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import Link from "next/link"
import GameWinFooter from "@/components/game-win-footer"
import ImageEffect from "@/components/image-effect"
import GameLoseFooter from "@/components/game-loose-footer"
import { useCoupons } from "@/hooks/use-coupons"

interface Emoji {
  id: number
  type: "😘" | "💋" | "❤️" | "🫢" | "👻" | "💝"
  x: number
  y: number
  disappearTime: number
}

const initialSpawnRate = 3500;
const minimalSpawnRate = 1000;
const gameDuration = 45;
const initialDisappearTime = 4000;
const minimalDisappearTime = 500;

export default function KissGamePage() {
  const [score, setScore] = useState(0)
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(gameDuration)
  const [spawnRate, setSpawnRate] = useState(initialSpawnRate)
  const [disappearTime, setDisappearTime] = useState(initialDisappearTime)
  const router = useRouter()
  const { markCouponAsWon } = useCoupons()

  useEffect(() => {
    //if (score >= 0 && gameOver) {
      markCouponAsWon(1)
    //}
  }, [score, gameOver])

  const playGoodSound = () => {
    if (typeof Audio !== 'undefined') {
      const sound = new Audio('/sounds/click-good.wav')
      sound.play()
    }
  }

  const playBadSound = () => {
    if (typeof Audio !== 'undefined') {
      const sound = new Audio('/sounds/click-bad.mp3')
      sound.play()
    }
  }

  const spawnEmoji = useCallback(() => {
    if (gameOver) return

    const emojiTypes = ["😘", "💋", "❤️", "🫢", "👻", "💝"] as const
    const weights = [0.15, 0.20, 0.25, 0.15, 0.15, 0.10]
    let random = Math.random()
    const type = emojiTypes[weights.findIndex((weight, i) => (random -= weight) < 0)]

    const newEmoji: Emoji = {
      id: Date.now(),
      type,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      disappearTime: Math.max(minimalDisappearTime, disappearTime * 0.9 + Math.random() * 300)
    }

    setEmojis((prevEmojis) => [...prevEmojis, newEmoji])

    setTimeout(() => {
      setEmojis((prevEmojis) => prevEmojis.filter((emoji) => emoji.id !== newEmoji.id))
    }, newEmoji.disappearTime)
  }, [gameOver, disappearTime])

  const handleClick = useCallback(
    (emoji: Emoji) => {
      if (gameOver) return
      setEmojis((prevEmojis) => prevEmojis.filter((e) => e.id !== emoji.id))

      switch (emoji.type) {
        case "😘":
          playGoodSound()
          setScore((prevScore) => prevScore + 100)
          break
        case "💋":
          playGoodSound()
          setScore((prevScore) => prevScore + 200)
          break
        case "❤️":
          playGoodSound()
          setScore((prevScore) => prevScore + 300)
          break
        case "🫢":
          playBadSound()
          setScore((prevScore) => prevScore - 100)
          break
        case "👻":
          playBadSound()
          setScore((prevScore) => prevScore - 200)
          break
        case "💝":
          playGoodSound()
          setScore((prevScore) => prevScore + 1000)
          break
      }
    },
    [gameOver]
  )

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const spawnInterval = setInterval(spawnEmoji, spawnRate)
    return () => clearInterval(spawnInterval)
  }, [spawnEmoji, spawnRate, gameOver, gameStarted])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [gameOver, gameStarted])

  useEffect(() => {
    if (gameOver) return
    if (timeLeft % 5 === 0 && spawnRate > minimalSpawnRate) {
      setSpawnRate((prev) => Math.max(minimalSpawnRate, prev * 0.8))
    }
    if (timeLeft % 5 === 0 && disappearTime > minimalDisappearTime) {
      setDisappearTime((prev) => Math.max(minimalDisappearTime, prev * 0.9))
    }
  }, [timeLeft, gameOver])

  const handleGameEnd = useCallback(() => {
    console.log("Final score:", score)
    router.push("/coupons")
  }, [score, router])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(gameDuration)
    setSpawnRate(initialSpawnRate)
    setDisappearTime(initialDisappearTime)
    setEmojis([])
  }

  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
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
          {gameStarted ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">Puntuación: {score}</div>
                <div className="text-2xl font-bold">Tiempo: {timeLeft}s</div>
                {gameOver && <div className="text-xl font-bold text-kawaii-pink-600">¡Juego terminado!</div>}
              </div>
              <div className="relative w-full h-[400px] bg-kawaii-pink-100 rounded-lg overflow-hidden">
                {gameOver && score > 0 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageEffect
                      src="/images/kiss.webp"
                      alt="Kiss"
                      width={300}
                      height={300}
                      active={gameOver}
                    />
                  </div>
                )}
                {gameOver && score >= 0 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageEffect
                      src="/images/sad.webp"
                      alt="Sad"
                      width={300}
                      height={300}
                      active={gameOver}
                    />
                  </div>
                )}
                {!gameOver && (
                  emojis.map((emoji) => (
                    <button
                      key={emoji.id}
                      className="absolute text-4xl transition-all duration-300 ease-in-out transform hover:scale-110"
                      style={{ left: `${emoji.x}%`, top: `${emoji.y}%` }}
                      onClick={() => handleClick(emoji)}
                      disabled={gameOver}
                    >
                      {emoji.type}
                    </button>
                  ))
                )}
              </div>
              {gameOver && score > 0 && (
                <GameWinFooter score={score} />
              )}
              {gameOver && score <= 0 && (
                <GameLoseFooter onRestart={() => {
                  setGameOver(false)
                  setScore(0)
                  setTimeLeft(gameDuration)
                  setSpawnRate(initialSpawnRate)
                  setDisappearTime(initialDisappearTime)
                  setEmojis([])
                }} />
              )}
            </>
          ) : (
            <div className="relative w-full h-[400px] bg-kawaii-pink-100 rounded-lg overflow-hidden flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 special-text">Atrapa todos los besos que puedas</h2>
              <button
                onClick={startGame}
                className="pixel-button"
              >
                Empezar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

