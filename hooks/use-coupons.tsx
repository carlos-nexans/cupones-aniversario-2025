import { useState, useEffect } from "react"

// Types
type CouponStatus = "active" | "expired" | "available" | "pending"

interface Coupon {
  id: number
  name: string
  description: string
  unlockDate: string
  expiryDate: string
  status: CouponStatus
  points: number
  icon: string
  obtainLink: string
}

interface CouponsState {
  totalPoints: number
  wonCoupons: Set<number> // Changed from array to Set of coupon IDs
}

const STORAGE_KEY = "anniversary-coupons-state"

const getInitialState = (): CouponsState => {
  if (typeof window === "undefined") {
    return {
      totalPoints: 100, // Default starting points
      wonCoupons: new Set(),
    }
  }

  const savedState = localStorage.getItem(STORAGE_KEY)
  if (!savedState) {
    return {
      totalPoints: 100,
      wonCoupons: new Set(),
    }
  }

  try {
    const parsed = JSON.parse(savedState)
    return {
      ...parsed,
      wonCoupons: new Set(parsed.wonCoupons), // Convert array from storage to Set
    }
  } catch {
    return {
      totalPoints: 100,
      wonCoupons: new Set(),
    }
  }
}

export const useCoupons = () => {
  const [state, setState] = useState<CouponsState>(() => getInitialState())

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      wonCoupons: Array.from(state.wonCoupons), // Convert Set to array for storage
    }))
  }, [state])

  // Mark a coupon as won/active
  const markCouponAsWon = (couponId: number, points: number) => {
    setState((prev) => ({
      ...prev,
      wonCoupons: new Set([...prev.wonCoupons, couponId]),
      totalPoints: prev.totalPoints + points,
    }))
  }

  // Check if a coupon is won
  const isCouponWon = (couponId: number) => {
    return state.wonCoupons.has(couponId)
  }

  return {
    totalPoints: state.totalPoints,
    wonCoupons: state.wonCoupons,
    markCouponAsWon,
    isCouponWon,
  }
}
