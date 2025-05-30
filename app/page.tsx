"use client"

import { useState, useEffect } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import CouponsScreen from "@/components/coupons-screen"
import { FloatingHearts } from "@/components/floating-hearts"

export const dynamic = 'force-dynamic'


export default function Home() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const authCookie = localStorage.getItem("auth")
    setAuthenticated(authCookie ? true : false)
  }, [])

  const handleAuthenticate = () => {
    setAuthenticated(true)
    localStorage.setItem("auth", "true")
  }

  return (
    <>
      <FloatingHearts />
      {!authenticated ? <WelcomeScreen onAuthenticate={handleAuthenticate} /> : <CouponsScreen />}
    </>
  )
}

