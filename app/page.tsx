"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import CouponsScreen from "@/components/coupons-screen"
import { FloatingHearts } from "@/components/floating-hearts"

export const dynamic = 'force-dynamic'

export default function Home() {
  const [authenticated, setAuthenticated] = useState(() => {
    const authCookie = localStorage.getItem("auth")
    return authCookie ? true : false
  })

  const handleAuthenticate = () => {
    setAuthenticated(true)
    localStorage.setItem("auth", "true")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      {!authenticated ? <WelcomeScreen onAuthenticate={handleAuthenticate} /> : <CouponsScreen />}
    </main>
  )
}

