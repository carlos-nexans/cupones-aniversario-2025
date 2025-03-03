"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { X, Minus, Square } from "lucide-react"

interface WelcomeScreenProps {
  onAuthenticate: () => void
}

export default function WelcomeScreen({ onAuthenticate }: WelcomeScreenProps) {
  const [passphrase, setPassphrase] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [error, setError] = useState("")
  const [isChecked, setIsChecked] = useState(false)

  const correctPassphrase = "teamo" // Ejemplo simple

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isChecked) {
      setError("Por favor, confirma que eres mi amorcito.")
      setTimeout(() => setError(""), 3000)
      return
    }

    if (passphrase.toLowerCase() === correctPassphrase) {
      onAuthenticate()
    } else {
      setError("Contraseña incorrecta. Intenta de nuevo.")
      setTimeout(() => setError(""), 3000)
    }
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="retro-window">
        <div className="retro-window-title">
          <span className="">Aniversario 2025</span>
          <div className="flex gap-1">
            <button className="border border-kawaii-blue-900 p-1 hover:bg-white/10 h-full">
              <Minus size={12} />
            </button>
            <button className="border border-kawaii-blue-900 p-1 hover:bg-white/10 h-full">
              <Square size={12} />
            </button>
            <button className="border border-kawaii-blue-900 p-1 hover:bg-white/10 h-full">
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="retro-window-content">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 relative float-animation mb-6">
              <Image
                src="/placeholder.svg?height=128&width=128"
                alt="Pixel Heart"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>

            <p className="text-lg text-center mb-6 text-black">¡Feliz aniversario!</p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="pixel-input w-full text-center"
                  placeholder="Ingresa la frase clave"
                />
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="notRobot"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="h-4 w-4 text-kawaii-blue-600 focus:ring-kawaii-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notRobot" className="text-sm text-gray-700">
                  No soy un robot del 200030, soy tu amorcito
                </label>
              </div>

              {error && <p className="text-destructive text-xs text-center">{error}</p>}

              <div className="flex flex-col gap-3">
                <button type="submit" className="pixel-button w-full">
                  Entrar
                </button>

                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-kawaii-blue-900 underline transition-colors"
                >
                  {showHint ? "Ocultar pista" : "Ver pista"}
                </button>
              </div>
            </form>

            {showHint && (
              <div className="mt-4 text-gray-900 text-center">
                <p>Pista: Lo que siempre te digo antes de dormir (sin espacios)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

