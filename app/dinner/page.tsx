"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, Minus, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import confetti from "confetti"

interface Ingredient {
  id: number
  name: string
  emoji: string
}

interface Dish {
  id: number
  name: string
  emoji: string
  requiredIngredients: string[]
}

// All possible dishes
const allDishes: Dish[] = [
  {
    id: 1,
    name: "Sushi",
    emoji: "🍣",
    requiredIngredients: ["Arroz", "Pescado", "Alga"],
  },
  {
    id: 2,
    name: "Ramen",
    emoji: "🍜",
    requiredIngredients: ["Fideos", "Caldo", "Huevo"],
  },
  {
    id: 3,
    name: "Pasta Carbonara",
    emoji: "🍝",
    requiredIngredients: ["Pasta", "Huevo", "Queso"],
  },
  {
    id: 4,
    name: "Pizza",
    emoji: "🍕",
    requiredIngredients: ["Masa", "Queso", "Tomate"],
  },
  {
    id: 5,
    name: "Risotto",
    emoji: "🍚",
    requiredIngredients: ["Arroz", "Caldo", "Vino"],
  },
  {
    id: 6,
    name: "Paella",
    emoji: "🥘",
    requiredIngredients: ["Arroz", "Azafrán", "Mariscos"],
  },
  {
    id: 7,
    name: "Tacos",
    emoji: "🌮",
    requiredIngredients: ["Tortilla", "Carne", "Salsa"],
  },
  {
    id: 8,
    name: "Curry",
    emoji: "🍛",
    requiredIngredients: ["Arroz", "Especias", "Verduras"],
  },
  {
    id: 9,
    name: "Fondue",
    emoji: "🧀",
    requiredIngredients: ["Queso", "Pan", "Vino"],
  },
  {
    id: 10,
    name: "Sopa de Mariscos",
    emoji: "🦞",
    requiredIngredients: ["Caldo", "Mariscos", "Verduras"],
  },
]

// All possible ingredients
const allIngredients: Ingredient[] = [
  { id: 1, name: "Arroz", emoji: "🍚" },
  { id: 2, name: "Pescado", emoji: "🐟" },
  { id: 3, name: "Alga", emoji: "🌿" },
  { id: 4, name: "Fideos", emoji: "🍜" },
  { id: 5, name: "Caldo", emoji: "🥣" },
  { id: 6, name: "Huevo", emoji: "🥚" },
  { id: 7, name: "Pasta", emoji: "🍝" },
  { id: 8, name: "Queso", emoji: "🧀" },
  { id: 9, name: "Masa", emoji: "🥖" },
  { id: 10, name: "Tomate", emoji: "🍅" },
  { id: 11, name: "Vino", emoji: "🍷" },
  { id: 12, name: "Azafrán", emoji: "🌱" },
  { id: 13, name: "Mariscos", emoji: "🦐" },
  { id: 14, name: "Tortilla", emoji: "🌯" },
  { id: 15, name: "Carne", emoji: "🥩" },
  { id: 16, name: "Salsa", emoji: "🥫" },
  { id: 17, name: "Especias", emoji: "🌶️" },
  { id: 18, name: "Verduras", emoji: "🥦" },
  { id: 19, name: "Pan", emoji: "🍞" },
]

const DISH_COUNT = 5
const GAME_TIME = 5
const INGREDIENTS_TO_SHOW = 6
const INGREDIENTS_TO_SELECT = 3

export default function RomanticDinnerGame() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [currentDishIndex, setCurrentDishIndex] = useState(0)
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [gameStarted, setGameStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Shuffle and select random dishes
  const initializeGame = useCallback(() => {
    // Shuffle dishes array
    const shuffledDishes = [...allDishes].sort(() => 0.5 - Math.random())

    // Select 5 random dishes
    const selectedDishes = shuffledDishes.slice(0, DISH_COUNT)

    setDishes(selectedDishes)
    setCurrentDishIndex(0)
    setGameOver(false)
    setGameWon(false)
    setTimeLeft(GAME_TIME)
    setSelectedIngredients([])
    setGameStarted(true)

    // Set up ingredients for the first dish
    setUpIngredientsForDish(selectedDishes[0])
  }, [])

  // Set up ingredients for a dish
  const setUpIngredientsForDish = useCallback((dish: Dish) => {
    // Get required ingredients for the dish
    const requiredIngredientNames = dish.requiredIngredients

    // Find the actual ingredient objects
    const requiredIngredients = requiredIngredientNames
      .map((name) => allIngredients.find((ing) => ing.name === name))
      .filter(Boolean) as Ingredient[]

    // Get other random ingredients
    const otherIngredients = allIngredients
      .filter((ing) => !requiredIngredientNames.includes(ing.name))
      .sort(() => 0.5 - Math.random())
      .slice(0, INGREDIENTS_TO_SHOW - requiredIngredients.length)

    // Combine and shuffle
    const shuffledIngredients = [...requiredIngredients, ...otherIngredients].sort(() => 0.5 - Math.random())

    setAvailableIngredients(shuffledIngredients)
    setSelectedIngredients([])
    setTimeLeft(GAME_TIME)

    // Reset the timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up for this dish
          clearInterval(timerRef.current as NodeJS.Timeout)
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Handle ingredient selection
  const handleIngredientClick = useCallback(
    (ingredient: Ingredient) => {
      if (gameOver || selectedIngredients.length >= INGREDIENTS_TO_SELECT) return

      // Add the ingredient to selected ingredients
      setSelectedIngredients((prev) => {
        // Don't add if already selected
        if (prev.some((ing) => ing.id === ingredient.id)) return prev

        const newSelected = [...prev, ingredient]

        // If we've selected 3 ingredients, check if correct
        if (newSelected.length === INGREDIENTS_TO_SELECT) {
          clearInterval(timerRef.current as NodeJS.Timeout)

          // Check if all required ingredients are selected
          const currentDish = dishes[currentDishIndex]
          const selectedNames = newSelected.map((ing) => ing.name)
          const requiredNames = currentDish.requiredIngredients

          const correct = requiredNames.every((name) => selectedNames.includes(name))

          if (!correct) {
            setGameOver(true)
          } else {
            // Move to next dish
            if (currentDishIndex < dishes.length - 1) {
              setTimeout(() => {
                setCurrentDishIndex((prev) => prev + 1)
                setUpIngredientsForDish(dishes[currentDishIndex + 1])
              }, 1000)
            } else {
              // Game won!
              setGameWon(true)
              // confetti
            }
          }
        }

        return newSelected
      })
    },
    [gameOver, selectedIngredients, dishes, currentDishIndex, setUpIngredientsForDish],
  )

  // Start the game
  useEffect(() => {
    initializeGame()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [initializeGame])

  const handleGameEnd = useCallback(() => {
    router.push("/")
  }, [router])

  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Cena Romántica</span>
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
            <div className="text-2xl font-bold">
              Plato {currentDishIndex + 1} de {dishes.length}
            </div>
            <div className="text-2xl font-bold">Tiempo: {timeLeft}s</div>
          </div>

          {gameStarted && dishes.length > 0 && (
            <div className="flex flex-col items-center">
              {/* Current dish */}
              <div className="text-6xl mb-4">{dishes[currentDishIndex].emoji}</div>
              <div className="text-2xl font-bold mb-6">{dishes[currentDishIndex].name}</div>

              {/* Selected ingredients */}
              <div className="flex justify-center gap-4 mb-6">
                {Array.from({ length: INGREDIENTS_TO_SELECT }).map((_, index) => (
                  <div
                    key={`slot-${index}`}
                    className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-3xl"
                  >
                    {selectedIngredients[index]?.emoji || ""}
                  </div>
                ))}
              </div>

              {/* Available ingredients */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {availableIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    className={`p-2 border-2 ${
                      selectedIngredients.some((ing) => ing.id === ingredient.id)
                        ? "border-pink-500 bg-pink-100"
                        : "border-gray-300 hover:border-pink-300 hover:bg-pink-50"
                    } rounded-lg flex flex-col items-center justify-center transition-colors`}
                    onClick={() => handleIngredientClick(ingredient)}
                    disabled={
                      gameOver ||
                      selectedIngredients.length >= INGREDIENTS_TO_SELECT ||
                      selectedIngredients.some((ing) => ing.id === ingredient.id)
                    }
                  >
                    <span className="text-2xl mb-1">{ingredient.emoji}</span>
                    <span className="text-sm font-medium">{ingredient.name}</span>
                  </button>
                ))}
              </div>

              {/* Game status */}
              {gameOver && !gameWon && (
                <div className="mt-6 text-center">
                  <p className="text-xl font-bold text-red-500 mb-2">¡Juego terminado!</p>
                  <p className="mb-4">{timeLeft === 0 ? "¡Se acabó el tiempo!" : "¡Ingredientes incorrectos!"}</p>
                  <p className="mb-4">
                    Los ingredientes correctos eran: {dishes[currentDishIndex].requiredIngredients.join(", ")}
                  </p>
                  <button className="pixel-button" onClick={initializeGame}>
                    Volver a intentar
                  </button>
                  <button className="pixel-button ml-2" onClick={handleGameEnd}>
                    Volver a los cupones
                  </button>
                </div>
              )}

              {gameWon && (
                <div className="mt-6 text-center">
                  <p className="text-xl font-bold text-green-500 mb-2">¡Felicidades!</p>
                  <p className="mb-4">¡Has preparado todos los platos correctamente!</p>
                  <button className="pixel-button" onClick={handleGameEnd}>
                    Volver a los cupones
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

