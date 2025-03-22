"use client";

import JSConfetti from "js-confetti";
import Link from "next/link";
import { useEffect } from "react";
export default function GameWinFooter({ score, label }: { score?: number, label: string }) {
  useEffect(() => {
    const playVictorySound = async () => {
      try {
        const audio = new Audio("/sounds/tadaa.mp3");
        audio.volume = 0.5; // Set volume to 50%
        await audio.play().catch((error) => {
          console.error("Error playing sound:", error);
        });
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };

    setTimeout(() => {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
    }, 900)
    playVictorySound();
  }, [score]);

  return (
    <div className="mt-4 text-center">
      {label && <p className="text-xl mb-2 font-bold">¡Felicidades! Has ganado {label}</p>}
      {score && score > 0 ? (
        <p className="text-xl mb-2">Tu puntuación final es: {score}</p>
      ) : null}
      <Link href="/">
        <button className="pixel-button">Volver a los cupones</button>
      </Link>
    </div>
  );
}
