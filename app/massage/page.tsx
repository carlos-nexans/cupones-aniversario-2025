"use client";

import GameWinFooter from "@/components/game-win-footer";
import { useCoupons } from "@/hooks/use-coupons";
import { Minus, Square, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RaspaGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [revealed, setRevealed] = useState(false);
  const prevPointRef = useRef<{ x: number; y: number } | null>(null);
  const {markCouponAsWon} = useCoupons();

  const checkScratchCompletion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(
      0,
      0,
      canvasSize.width,
      canvasSize.height
    );
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
      // confetti;
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    }
  }, [canvasSize, revealed]);

  useEffect(() => {
    if (revealed) {
      markCouponAsWon(3);
    }
  }, [revealed]);

  const drawScratch = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";

      // Draw the circle at current position
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();

      // If we have a previous point, connect it to the current point
      if (prevPointRef.current) {
        ctx.beginPath();
        ctx.lineWidth = 40; // Make the line width double the circle radius
        ctx.lineCap = "round";
        ctx.moveTo(prevPointRef.current.x, prevPointRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      prevPointRef.current = { x, y };
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isScratching || revealed) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only scratch if within canvas bounds
      if (x >= 0 && x <= canvasSize.width && y >= 0 && y <= canvasSize.height) {
        drawScratch(ctx, x, y);
        checkScratchCompletion();
      }
    },
    [isScratching, revealed, checkScratchCompletion, canvasSize, drawScratch]
  );

  // Handle touch events
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (!isScratching || revealed) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (x >= 0 && x <= canvasSize.width && y >= 0 && y <= canvasSize.height) {
        drawScratch(ctx, x, y);
        checkScratchCompletion();
      }
    },
    [isScratching, revealed, checkScratchCompletion, canvasSize, drawScratch]
  );

  useEffect(() => {
    if (revealed) return;

    const handleGlobalMouseUp = () => {
      setIsScratching(false);
      prevPointRef.current = null; // Reset the previous point when mouse is released
      checkScratchCompletion();
    };

    // Add global event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleTouchMove as any, {
      passive: false,
    });
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleTouchMove as any);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [handleMouseMove, handleTouchMove, checkScratchCompletion, revealed]);

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
        ctx.fillText(
          text,
          (canvasSize.width - textWidth) / 2,
          canvasSize.height / 2
        );
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
            <button
              className="p-1 hover:bg-white/10 rounded"
              onClick={() => router.push("/")}
            >
              <X size={12} />
            </button>
          </div>
        </div>

        <div className="retro-window-content justify-center flex flex-col text-center items-center">
          <div style={{ position: "relative" }} className="w-auto">
            <Image
              src="/images/massage.webp"
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
                onMouseDown={(e) => {
                  setIsScratching(true);
                  prevPointRef.current = null; // Reset the previous point when starting to scratch
                }}
                onTouchStart={(e) => {
                  setIsScratching(true);
                  prevPointRef.current = null; // Reset the previous point when starting to scratch
                }}
              />
            )}
          </div>

          {revealed && <GameWinFooter />}
        </div>
      </div>
    </div>
  );
}
