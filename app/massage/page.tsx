"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Minus, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import confetti from "confetti";

export default function RaspaGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [revealed, setRevealed] = useState(false);

const checkScratchCompletion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
    const totalPixels = imageData.data.length / 4;
    let clearedPixels = 0;

    // Umbral de transparencia, considera raspado si la opacidad (canal alpha) es menor a 128
    const TRANSPARENCY_THRESHOLD = 128;

    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] < TRANSPARENCY_THRESHOLD) {
            clearedPixels++;
        }
    }

    const percentageCleared = (clearedPixels / totalPixels) * 100;
    console.log(`Porcentaje de raspado: ${percentageCleared.toFixed(2)}%`);

    if (percentageCleared >= 90 && !revealed) {
        setRevealed(true);
        confetti.confetti();
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    }
}, [canvasSize, revealed]);

  const handleMouseDown = useCallback(() => {
    setIsScratching(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsScratching(false);
    checkScratchCompletion();
  }, [checkScratchCompletion]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isScratching || revealed) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      checkScratchCompletion();
    },
    [isScratching, revealed, checkScratchCompletion]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#d3d3d3";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "#000";
        const text = "Raspa para ganar";
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, (canvasSize.width - textWidth) / 2, canvasSize.height / 2);
      }
    }
  }, [canvasSize]);

  return (
    <div className="w-full max-w-2xl relative z-10 mx-auto mt-8">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Raspa para ganar</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-white/10 rounded">
              <Minus size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded">
              <Square size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded" onClick={() => router.push("/")}> 
              <X size={12} />
            </button>
          </div>
        </div>

        <div className="retro-window-content justify-center flex flex-col text-center items-center">
          <div style={{ position: "relative" }} className="w-auto">
            <Image
              src="/your-prize-image.jpg"
              alt="Premio"
              width={canvasSize.width}
              height={canvasSize.height}
            />
            {!revealed && (
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  borderRadius: "8px",
                  touchAction: "none",
                  cursor: "pointer",
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
              />
            )}
          </div>
          {revealed && <p className="mt-4 text-lg font-bold">¡Felicidades! Has ganado.</p>}
        </div>
      </div>
    </div>
  );
}

