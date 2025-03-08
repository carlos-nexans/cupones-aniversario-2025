"use client";

import Link from "next/link";
import { useEffect } from "react";
import JSConfetti from "js-confetti";

export default function GameLoseFooter({ score, onRestart }: { score?: number, onRestart: () => void }) {
  useEffect(() => {
    const playLooseSound = async () => {
      try {
        const audio = new Audio("/sounds/loose.mp3");
        audio.volume = 0.5; // Set volume to 50%
        await audio.play().catch((error) => {
          console.error("Error playing sound:", error);
        });
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };

    playLooseSound();
  }, []);

  return (
    <div className="mt-4 text-center">
      <p className="text-xl mb-2 font-bold">¡Lo siento! Has perdido.</p>
      <div className="flex justify-center gap-4">
        <button className="pixel-button" onClick={onRestart}>Intentar de nuevo</button>
        <Link href="/">
          <button className="pixel-button">Volver a los cupones</button>
        </Link>
      </div>
    </div>
  );
}
