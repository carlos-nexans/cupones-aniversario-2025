"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import CouponsScreen from "@/components/coupons-screen"
import { FloatingHearts } from "@/components/floating-hearts"

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false)

  const handleAuthenticate = () => {
    setAuthenticated(true)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      {!authenticated ? <WelcomeScreen onAuthenticate={handleAuthenticate} /> : <CouponsScreen />}
    </main>
  )
}

