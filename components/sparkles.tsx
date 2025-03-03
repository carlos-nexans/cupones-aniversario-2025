"use client"

import { useEffect, useState } from "react"

export function Sparkles() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([])

  useEffect(() => {
    const initialSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setSparkles(initialSparkles)

    const interval = setInterval(() => {
      setSparkles((currentSparkles) =>
        currentSparkles.map((sparkle) => ({
          ...sparkle,
          left: Math.random() * 100,
          top: Math.random() * 100,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  )
}

