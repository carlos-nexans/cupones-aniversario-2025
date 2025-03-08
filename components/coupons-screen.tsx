"use client";

import { useState } from "react";
import Image from "next/image";
import { WhatsappIcon } from "@/components/icons";
import { X, Minus, Square, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCoupons } from "@/hooks/use-coupons";
import Link from "next/link";

// Updated coupon data structure
const coupons = [
  {
    id: 1,
    name: "Un beso",
    description: "Canjeable por un beso apasionado",
    unlockDate: "2024-03-01",
    expiryDate: "2024-03-31",
    status: "available", // active, expired, available, pending
    points: 100,
    icon: "/images/kiss.webp",
    obtainLink: "/kiss-game",
  },
  {
    id: 2,
    name: "Una cena romántica",
    description: "Canjeable por una cena romántica a la luz de las velas",
    unlockDate: "2024-04-01",
    expiryDate: "2024-04-30",
    status: "available", // Updated status
    points: 200,
    icon: "/images/dinner.webp",
    obtainLink: "/dinner", // Updated obtainLink
  },
  {
    id: 3,
    name: "Un masaje",
    description: "Canjeable por un masaje relajante",
    unlockDate: "2024-05-01",
    expiryDate: "2024-05-31",
    status: "available",
    points: 150,
    icon: "/images/massage.webp",
    obtainLink: "/massage",
  },
  {
    id: 4,
    name: "Una noche sensual",
    description: "Canjeable por una noche sensual",
    unlockDate: "2024-06-01",
    expiryDate: "2024-06-30",
    status: "available",
    points: 300,
    icon: "/images/secret.webp",
    obtainLink: "/memory-game",
  },
  {
    id: 5,
    name: "Un picnic",
    description: "Canjeable por un picnic al aire libre",
    unlockDate: "2024-07-01",
    expiryDate: "2024-07-31",
    status: "available",
    points: 250,
    icon: "/images/picnic.webp",
    obtainLink: "/picnic",
  },
  {
    id: 6,
    name: "Un día en la naturaleza",
    description: "Canjeable por un día en la naturaleza",
    unlockDate: "2024-08-01",
    expiryDate: "2024-08-31",
    status: "available",
    points: 250,
    icon: "/images/nature.webp",
    obtainLink: "/nature",
  },
  {
    id: 7,
    name: "Una tarde de juegos",
    description: "Canjeable por una tarde de juegos juntos",
    unlockDate: "2024-09-01",
    expiryDate: "2024-09-30",
    status: "available",
    points: 200,
    icon: "/images/boardgames.webp",
    obtainLink: "/boardgames",
  },
  {
    id: 8,
    name: "Una sorpresa",
    description: "Canjeable por una sorpresa",
    unlockDate: "2024-10-01",
    expiryDate: "2024-10-31",
    status: "pending",
    points: 200,
    icon: "/images/mistery.webp",
    obtainLink: "/mistery",
  },
];

export default function CouponsScreen() {
  const { totalPoints, wonCoupons, markCouponAsWon } = useCoupons();
  const router = useRouter();

  const activeCoupons = coupons.filter((coupon) =>
    wonCoupons.includes(coupon.id)
  );
  const availableCoupons = coupons.filter(
    (coupon) => coupon.status === "available" && !wonCoupons.includes(coupon.id)
  );
  const expiredCoupons = coupons
    .filter((coupon) => coupon.status === "expired")
    .sort(
      (a, b) =>
        new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    );
  const pendingCoupons = coupons
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
      `https://wa.me/TUNUMERO?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const renderCoupon = (coupon: (typeof coupons)[0]) => (
    <div key={coupon.id} className="pixel-card mb-4">
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
        <div className="w-24 h-24 sm:h-auto relative">
          {coupon.status != "pending" && (
            <Image
              src={coupon.icon || "/placeholder.svg"}
              alt={coupon.name}
              layout="fill"
              objectFit="contain"
              className="sm:absolute inset-0"
            />
          )}
          {coupon.status === "pending" && (
            <Image
              src="/images/unknown.webp"
              alt={coupon.name}
              layout="fill"
              objectFit="contain"
              className="sm:absolute inset-0"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-black mb-1">
            {coupon.status === "pending" ? "???" : coupon.name}
          </h3>
          <p className="mb-2 text-black/70">
            {coupon.status === "pending"
              ? "Cupón misterioso"
              : coupon.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-kawaii-blue-900">
              {coupon.status === "pending"
                ? `Disponible: ${new Date(
                    coupon.unlockDate
                  ).toLocaleDateString()}`
                : `Expira: ${new Date(coupon.expiryDate).toLocaleDateString()}`}
            </span>

            {coupon.status === "active" && (
              <button
                onClick={() => handleClaimCoupon(coupon.id)}
                className="flex items-center gap-1 bg-kawaii-mint border-2 border-black text-black px-2 py-1 rounded-md"
              >
                <WhatsappIcon className="w-4 h-4" />
                <span>Reclamar</span>
              </button>
            )}

            {coupon.status === "available" && (
              <Link href={coupon.obtainLink}>
                <button className="flex items-center gap-1 bg-kawaii-blue border-2 border-black text-black px-2 py-1 rounded-md">
                  <Sparkle className="w-4 h-4" />
                  <span>Obtener</span>
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
            {activeCoupons.map(renderCoupon)}
            {availableCoupons.map(renderCoupon)}
            {expiredCoupons.map(renderCoupon)}

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
