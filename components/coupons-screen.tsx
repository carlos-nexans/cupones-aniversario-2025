"use client";

import { useState } from "react";
import Image from "next/image";
import { WhatsappIcon } from "@/components/icons";
import { X, Minus, Square, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCoupons } from "@/hooks/use-coupons";
import Link from "next/link";

type Coupon = {
  id: number;
  name: string;
  description: string;
  unlockDate: string;
  expiryDate: string;
  points: number;
  icon: string;
  obtainLink: string;
};

type CouponStatus = "pending" | "available" | "expired";

type ProcessedCoupon = Coupon & {
  status: CouponStatus;
  won: boolean;
};

const coupons: Coupon[] = [
  {
    id: 1,
    name: "Un beso",
    description: "Canjeable por un beso apasionado",
    unlockDate: "2025-03-01",
    expiryDate: "2025-03-31",
    points: 100,
    icon: "/images/kiss.webp",
    obtainLink: "/kiss-game",
  },
  {
    id: 2,
    name: "Una cena romántica",
    description: "Canjeable por una cena romántica a la luz de las velas",
    unlockDate: "2025-04-01",
    expiryDate: "2025-04-30",
    points: 200,
    icon: "/images/dinner.webp",
    obtainLink: "/dinner",
  },
  {
    id: 3,
    name: "Un masaje",
    description: "Canjeable por un masaje relajante",
    unlockDate: "2025-05-01",
    expiryDate: "2025-05-31",
    points: 150,
    icon: "/images/massage.webp",
    obtainLink: "/massage",
  },
  {
    id: 4,
    name: "Una noche sensual",
    description: "Canjeable por una noche sensual",
    unlockDate: "2025-06-01",
    expiryDate: "2025-06-30",
    points: 300,
    icon: "/images/secret.webp",
    obtainLink: "/memory-game",
  },
  {
    id: 5,
    name: "Un picnic",
    description: "Canjeable por un picnic al aire libre",
    unlockDate: "2025-07-01",
    expiryDate: "2025-07-31",
    points: 250,
    icon: "/images/picnic.webp",
    obtainLink: "/picnic",
  },
  {
    id: 6,
    name: "Un día en la naturaleza",
    description: "Canjeable por un día en la naturaleza",
    unlockDate: "2025-08-01",
    expiryDate: "2025-08-31",
    points: 250,
    icon: "/images/nature.webp",
    obtainLink: "/nature",
  },
  {
    id: 7,
    name: "Una tarde de juegos",
    description: "Canjeable por una tarde de juegos juntos",
    unlockDate: "2025-09-01",
    expiryDate: "2025-09-30",
    points: 200,
    icon: "/images/boardgames.webp",
    obtainLink: "/boardgames",
  },
  {
    id: 8,
    name: "Una sorpresa",
    description: "Canjeable por una sorpresa",
    unlockDate: "2025-10-01",
    expiryDate: "2025-10-31",
    points: 200,
    icon: "/images/mistery.webp",
    obtainLink: "/mistery",
  },
];

const computeCouponStatus = (unlockDate: string, expiryDate: string): CouponStatus => {
  const today = process.env.NEXT_PUBLIC_DEBUG_DATE 
    ? new Date(process.env.NEXT_PUBLIC_DEBUG_DATE)
    : new Date();
  const unlock = new Date(unlockDate);
  const expiry = new Date(expiryDate);

  if (process.env.NEXT_PUBLIC_DEBUG_STATUS) {
    return process.env.NEXT_PUBLIC_DEBUG_STATUS as CouponStatus;
  }

  if (today < unlock) return "pending";
  if (today <= expiry) return "available";
  return "expired";
};

export default function CouponsScreen() {
  const { totalPoints, wonCoupons, markCouponAsWon } = useCoupons();
  const router = useRouter();

  const isCouponWon = (id: number): boolean => {
    if (process.env.NEXT_PUBLIC_DEBUG_WON !== undefined) {
      return process.env.NEXT_PUBLIC_DEBUG_WON === "true";
    }
    return wonCoupons.has(id);
  };

  const processedCoupons = coupons.map(coupon => ({
    ...coupon,
    status: computeCouponStatus(coupon.unlockDate, coupon.expiryDate),
    won: isCouponWon(coupon.id)
  }));

  console.log(processedCoupons);

  const activeCoupons = processedCoupons.filter((coupon) => 
    coupon.won && coupon.status === "available"
  );
  const availableCoupons = processedCoupons.filter(
    (coupon) => coupon.status === "available" && !coupon.won
  );
  const expiredCoupons = processedCoupons
    .filter((coupon) => coupon.status === "expired")
    .sort(
      (a, b) =>
        new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    );
  const pendingCoupons = processedCoupons
    .filter((coupon) => coupon.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime()
    );

  const handleClaimCoupon = (id: number) => {
    const message = `Quiero canjear mi cupón: ${
      coupons.find((c) => c.id === id)?.name
    }`;
    window.open(
      `/api/claim?message=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const renderCoupon = (coupon: ProcessedCoupon) => (
    <div key={coupon.id} className="pixel-card mb-4">
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
        <div className="w-24 h-24 sm:h-auto relative">
          {(coupon.won || coupon.status === "available") ? (
            <Image
              src={coupon.icon || "/placeholder.svg"}
              alt={coupon.name}
              layout="fill"
              objectFit="contain"
              className="sm:absolute inset-0"
            />
          ) : (
            <Image
              src="/images/unknown.webp"
              alt="Cupón misterioso"
              layout="fill"
              objectFit="contain"
              className="sm:absolute inset-0"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-black mb-1">
            {coupon.won || coupon.status === "available" ? coupon.name : "???"}
          </h3>
          <p className="mb-2 text-black/70">
            {coupon.won || coupon.status === "available" 
              ? coupon.description 
              : "Cupón misterioso"}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-kawaii-blue-900">
              {coupon.status === "pending"
                && `Disponible: ${new Date(
                    coupon.unlockDate
                  ).toLocaleDateString()}`}
                {coupon.status === "available" && `Expira: ${new Date(coupon.expiryDate).toLocaleDateString()}`}
                {coupon.status === "expired" && !coupon.won && `Expirado ${new Date(coupon.expiryDate).toLocaleDateString()}`}
            </span>

            {coupon.won && coupon.status === "available" && (
              <button
                onClick={() => handleClaimCoupon(coupon.id)}
                className="flex items-center gap-1 bg-kawaii-mint border-2 border-black text-black px-2 py-1 rounded-md"
              >
                <WhatsappIcon className="w-4 h-4" />
                <span>Reclamar</span>
              </button>
            )}

            {coupon.status === "available" && !coupon.won && (
              <Link href={coupon.obtainLink}>
                <button className="flex items-center gap-1 bg-kawaii-blue border-2 border-black text-black px-2 py-1 rounded-md">
                  <Sparkle className="w-4 h-4" />
                  <span>Obtener</span>
                </button>
              </Link>
            )}

            {coupon.status === "expired" && coupon.won && (
              <Link href={coupon.obtainLink}>
                <button className="flex items-center gap-1 bg-kawaii-blue border-2 border-black text-black px-2 py-1 rounded-md">
                  <Sparkle className="w-4 h-4" />
                  <span>Volver a jugar</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl relative z-10">
      <div className="retro-window">
        <div className="retro-window-title">
          <span>Cupones de Aniversario</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-white/10 rounded">
              <Minus size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded">
              <Square size={12} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded">
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="retro-window-content">
          <div className="flex justify-end mb-6">
            <div className="flex items-center bg-kawaii-purple-300 gap-2 px-3 py-1 rounded-full border border-kawaii-purple-900">
              <span className="text-kawaii-purple-900">Puntos:</span>
              <span className="text-kawaii-purple-900">{totalPoints}</span>
            </div>
          </div>

          <div className="space-y-6">
            {activeCoupons.length > 0 && (
              <>
                <div className="flex gap-2 mb-2">
                  <div className="px-3 py-2 rounded-full bg-kawaii-purple-300 text-kawaii-purple-900 border border-kawaii-purple-900">
                    Activos
                  </div>
                </div>
                {activeCoupons.map(renderCoupon)}
              </>
            )}
            {availableCoupons.length > 0 && (
              <>
                <div className="flex gap-2 mb-2">
                  <div className="px-3 py-2 rounded-full bg-kawaii-purple-300 text-kawaii-purple-900 border border-kawaii-purple-900">
                    Disponibles
                  </div>
                </div>
                {availableCoupons.map(renderCoupon)}
              </>
            )}
            {expiredCoupons.length > 0 && (
              <>
                <div className="flex gap-2 mb-2">
                  <div className="px-3 py-2 rounded-full bg-kawaii-purple-300 text-kawaii-purple-900 border border-kawaii-purple-900">
                    Expirados
                  </div>
                </div>
                {expiredCoupons.map(renderCoupon)}
              </>
            )}

            {pendingCoupons.length > 0 && (
              <>
                <div className="flex gap-2 mb-2">
                  <div className="px-3 py-2 rounded-full bg-kawaii-purple-300 text-kawaii-purple-900 border border-kawaii-purple-900">
                    Próximos
                  </div>
                </div>
                {pendingCoupons.map(renderCoupon)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
