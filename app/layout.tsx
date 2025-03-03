import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cupones de Aniversario",
  description: "Un regalo especial para nuestro aniversario",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}



import './globals.css'