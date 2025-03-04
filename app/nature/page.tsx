"use client"
import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { X, Minus, Square } from "lucide-react"
import { useRouter } from "next/navigation"

// Creature definitions
type CreatureType = "butterfly" | "blossom" | "arcoiris" | "bee" | "ladybug" | "caterpillar"

interface Creature {
  id: number
  type: CreatureType
  x: number // In canvas pixels
  y: number // In canvas pixels
  speed: number // Movement in px/frame
  direction: number // Radians
}

// Game constants
const GAME_DURATION = 30 // seconds
const SPAWN_INTERVAL = 1000 // ms
const CATCH_DISTANCE = 30 // radius in px for easier tapping
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 400

// Scoring
const getPoints = (type: CreatureType): number => {
  // Positive
  if (type === "butterfly") return 10
  if (type === "blossom") return 15
  if (type === "arcoiris") return 30
  // Negative
  return -10
}

export default function NatureGamePage() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameOver, setGameOver] = useState(false)
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [netPos, setNetPos] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  // Add a ref to track whether the confetti script has loaded
  const confettiLoadedRef = useRef(false)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw creatures
    creatures.forEach((c) => {
      let emoji = "❓"
      switch (c.type) {
        case "butterfly":
          emoji = "🦋"
          break
        case "blossom":
          emoji = "🌸"
          break
        case "arcoiris":
          emoji = "🌈"
          break
        case "bee":
          emoji = "🐝"
          break
        case "ladybug":
          emoji = "🐞"
          break
        case "caterpillar":
          emoji = "🐛"
          break
      }

      // Use a large font so emojis look sharper
      ctx.font = "24px Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(emoji, c.x, c.y)
    })

    // Draw net
    ctx.beginPath()
    ctx.arc(netPos.x, netPos.y, 15, 0, Math.PI * 2)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#000000"
    ctx.stroke()
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.fill()
  }, [creatures, netPos])

  // Load confetti script dynamically
  useEffect(() => {
    if (!confettiLoadedRef.current) {
      const script = document.createElement("script")
      script.src = "confetti"
      script.async = true
      script.onload = () => {
        confettiLoadedRef.current = true
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Function to safely call confetti
  const launchConfetti = useCallback(() => {
    if (window.confetti) {
      window.confetti()
    }
  }, [])

  // Spawn creatures
  const spawnCreature = useCallback(() => {
    if (gameOver) return

    // Weighted array of possible types
    const types: CreatureType[] = [
      "butterfly",
      "butterfly", // Added extra to increase probability
      "blossom",
      "arcoiris",
      "bee",
      "ladybug",
      "caterpillar",
    ]
    const type = types[Math.floor(Math.random() * types.length)]

    setCreatures((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(), // Ensure unique IDs
        type,
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        speed: 1 + Math.random() * 2,
        direction: Math.random() * Math.PI * 2,
      },
    ])
  }, [gameOver])

  // Move creatures & bounce off canvas edges
  const moveCreatures = useCallback(() => {
    setCreatures((prev) =>
      prev.map((c) => {
        let { x, y, direction, speed } = c

        // Slightly randomize direction sometimes for more natural movement
        if (Math.random() < 0.05) {
          direction += (Math.random() - 0.5) * 0.5
        }

        x += Math.cos(direction) * speed
        y += Math.sin(direction) * speed

        // Bounce horizontally
        if (x < 0) {
          x = 0
          direction = Math.PI - direction
        } else if (x > CANVAS_WIDTH) {
          x = CANVAS_WIDTH
          direction = Math.PI - direction
        }

        // Bounce vertically
        if (y < 0) {
          y = 0
          direction = -direction
        } else if (y > CANVAS_HEIGHT) {
          y = CANVAS_HEIGHT
          direction = -direction
        }

        return { ...c, x, y, direction }
      }),
    )
  }, [])

  // Pointer move => update net position
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    setNetPos({ x, y })
  }, [])

  // Pointer down => attempt to catch
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (gameOver || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = CANVAS_WIDTH / rect.width
      const scaleY = CANVAS_HEIGHT / rect.height
      const clickX = (e.clientX - rect.left) * scaleX
      const clickY = (e.clientY - rect.top) * scaleY

      let closestCreature: Creature | null = null
      let minDistance = CATCH_DISTANCE

      for (const creature of creatures) {
        const dist = Math.hypot(creature.x - clickX, creature.y - clickY)
        if (dist <= CATCH_DISTANCE && dist < minDistance) {
          closestCreature = creature
          minDistance = dist
        }
      }
      let scoreChange = closestCreature ? getPoints(closestCreature.type): 0
      let caughtArcoiris = false

      

      // Update creatures and score
      setCreatures((prev) => {
        if (closestCreature) {
          // Remove the caught creature
          return prev.filter((c) => c.id !== closestCreature!.id)
        }

        return prev
      })

      setScore((prev) => prev + scoreChange)
    },
    [gameOver, launchConfetti],
  )

  // Use requestAnimationFrame for the movement & drawing
  useEffect(() => {
    let frameId: number

    const animate = () => {
      if (!gameOver) {
        moveCreatures()
        draw()
        frameId = requestAnimationFrame(animate)
      }
    }

    // Start animation
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [moveCreatures, draw, gameOver])

  // Spawn creatures every second
  useEffect(() => {
    if (gameOver) return

    // Spawn one creature immediately
    spawnCreature()

    const interval = setInterval(spawnCreature, SPAWN_INTERVAL)
    return () => clearInterval(interval)
  }, [spawnCreature, gameOver])

  // Game timer
  useEffect(() => {
    if (gameOver) return
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (confettiLoadedRef.current) {
            launchConfetti()
          }
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerId)
  }, [gameOver, launchConfetti])

  // Resize for device pixel ratio => crisp emojis
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
      // Set default font so it's ready for the first draw
      ctx.font = "24px Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif"
    }
  }, [])

  const handleGameEnd = useCallback(() => {
    console.log("Final score:", score)
    router.push("/")
  }, [router, score])

  // Add an explicit loading of game instructions
  useEffect(() => {
    // Force a redraw on component mount
    const initialDraw = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear the canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw initial instructions
      ctx.font = "16px sans-serif"
      ctx.fillStyle = "#000"
      ctx.textAlign = "center"
      ctx.fillText("El juego empezará en un momento...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20)
      ctx.fillText("¡Atrapa las mariposas (🦋) y flores (🌸)!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
    }

    initialDraw()
  }, [])

  // Return statement with the UI
  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Atrapa mariposas</span>
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
            <div className="text-2xl font-bold">Tiempo: {timeLeft}s</div>
          </div>

          {/* Game instructions */}
          <div className="mb-4 text-sm">
            <p>🦋 = +10pts | 🌸 = +15pts | 🌈 = +30pts | Otros = -10pts</p>
          </div>

          {/* Canvas container */}
          <div
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              backgroundColor: "#ffffff",
              position: "relative",
              border: "1px solid #ccc",
              touchAction: "none",
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ touchAction: "none", display: "block" }}
              onPointerMove={handlePointerMove}
              onPointerDown={handlePointerDown}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-lg mb-2">Toca o haz clic en las criaturas para atraparlas</p>
          </div>

          {gameOver && (
            <div className="mt-4 text-center">
              <p className="text-xl mb-2">¡Felicidades! Tu puntuación final es: {score}</p>
              <button className="pixel-button" onClick={handleGameEnd}>
                Volver a los cupones
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

