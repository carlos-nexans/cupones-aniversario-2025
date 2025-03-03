"use client"

import { Heart } from "lucide-react"
import { useEffect, useState } from "react"

export function FloatingHearts() {
    const hearts = Array.from({ length: 20 })

  return (
    <div className="wrapper">
      {hearts.map((heart) => (
      <>
     
        <div className="heart" />
          </>
      ))}
    </div>
  )
}

