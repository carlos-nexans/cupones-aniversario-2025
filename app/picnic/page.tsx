"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, Minus, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import GameWinFooter from "@/components/game-win-footer"
import GameLoseFooter from "@/components/game-loose-footer"
import { useCoupons } from "@/hooks/use-coupons"

export const dynamic = 'force-dynamic'

interface Ant {
  id: number
  x: number
  y: number
  targetIndex: number
}

const snacks = ["🍎", "🍏", "🍌", "🥪", "🥗", "🧃"]
const gameDuration = 30
const antSpeed = 0.5
const antSpawnInterval = 1000
const pointsPerSecond = 10
const pointsLostPerAntTouch = 50

export default function PicnicGamePage() {
  const [score, setScore] = useState(0)
  const [ants, setAnts] = useState<Ant[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(gameDuration)
  const [availableSnacks, setAvailableSnacks] = useState([...snacks])
  const [antsTouched, setAntsTouched] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { markCouponAsWon } = useCoupons()

  const spawnAnt = useCallback(() => {
    if (gameOver || !gameStarted) return

    const side = Math.floor(Math.random() * 4)
    let x, y
    switch (side) {
      case 0: // top
        x = Math.random() * 100
        y = 0
        break
      case 1: // right
        x = 100
        y = Math.random() * 100
        break
      case 2: // bottom
        x = Math.random() * 100
        y = 100
        break
      default: // left
        x = 0
        y = Math.random() * 100
    }

    const newAnt: Ant = {
      id: Date.now(),
      x,
      y,
      targetIndex: Math.floor(Math.random() * availableSnacks.length),
    }

    setAnts((prevAnts) => [...prevAnts, newAnt])
  }, [gameOver, availableSnacks.length, gameStarted])

  const moveAnts = useCallback(() => {
    if (!gameStarted) return
    setAnts(
      (prevAnts) =>
        prevAnts
          .map((ant) => {
            const targetX = 50 // Center X
            const targetY = 50 // Center Y

            const dx = targetX - ant.x
            const dy = targetY - ant.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < antSpeed) {
              // Ant has reached the target
              setAntsTouched((prev) => {
                const newTouched = prev + 1
                if (newTouched % 3 === 0) {
                  setAvailableSnacks((prevSnacks) => prevSnacks.slice(0, -1))
                }
                return newTouched
              })
              setScore((prevScore) => Math.max(0, prevScore - pointsLostPerAntTouch))
              return null // Remove the ant
            }

            const ratio = antSpeed / distance
            return {
              ...ant,
              x: ant.x + dx * ratio,
              y: ant.y + dy * ratio,
            }
          })
          .filter(Boolean) as Ant[],
    )
  }, [gameStarted])

  const handleAntClick = useCallback((antId: number) => {
    setAnts((prevAnts) => prevAnts.filter((ant) => ant.id !== antId))
    setScore((prevScore) => prevScore + 5) // Bonus points for clicking an ant
  }, [])

  useEffect(() => {
    if (gameOver || !gameStarted) return
    const spawnInterval = setInterval(spawnAnt, antSpawnInterval)
    const moveInterval = setInterval(moveAnts, 50)
    return () => {
      clearInterval(spawnInterval)
      clearInterval(moveInterval)
    }
  }, [spawnAnt, moveAnts, gameOver, gameStarted])

  useEffect(() => {
    if (gameOver || !gameStarted) return
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          // confetti
          return 0
        }
        setScore((prevScore) => prevScore + pointsPerSecond)
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [gameOver, gameStarted])

  useEffect(() => {
    if (availableSnacks.length === 0) {
      setGameOver(true)
    }
  }, [availableSnacks])

  useEffect(() => {
    if (gameOver && score > 0) {
      markCouponAsWon(5, score)
    }
  }, [gameOver, score])

  const handleGameEnd = useCallback(() => {
    console.log("Final score:", score)
    router.push("/")
  }, [score, router])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(gameDuration)
    setAvailableSnacks([...snacks])
    setAnts([])
    setAntsTouched(0)
    setGameOver(false)
  }

  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Picnic Protector</span>
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
          {!gameStarted ? (
            <div className="relative w-full h-[400px] bg-kawaii-yellow-100 rounded-lg overflow-hidden flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 special-text">¡Protege tu picnic de las hormigas!</h2>
              <button
                onClick={startGame}
                className="pixel-button"
              >
                Empezar
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">Puntuación: {score}</div>
                <div className="text-2xl font-bold">Tiempo: {timeLeft}s</div>
                {gameOver && <div className="text-xl font-bold text-kawaii-pink-600">¡Juego terminado!</div>}
              </div>
              <div ref={gameAreaRef} className="relative w-full h-[400px] bg-kawaii-yellow-100 rounded-lg overflow-hidden">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
                  {availableSnacks.join("")}
                </div>
                {ants.map((ant) => (
                  <button
                    key={ant.id}
                    className="absolute text-2xl transition-all duration-50 ease-linear transform hover:scale-125 cursor-pointer"
                    style={{ left: `${ant.x}%`, top: `${ant.y}%` }}
                    onClick={() => handleAntClick(ant.id)}
                  >
                    🐜
                  </button>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg mb-2">¡Protege tu picnic! Haz clic en las hormigas para eliminarlas.</p>
              </div>
              {gameOver && score > 0 && (
                <GameWinFooter score={score} label="un picnic en el parque" />
              )}
              {gameOver && score <= 0 && (
                <GameLoseFooter onRestart={() => {
                  setGameOver(false)
                  setScore(0)
                  setTimeLeft(gameDuration)
                  setAvailableSnacks([...snacks])
                  setAnts([])
                  setAntsTouched(0)
                }} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

