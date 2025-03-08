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
  wonCoupons: number[] // Array of coupon IDs that are won/active
}

const STORAGE_KEY = "anniversary-coupons-state"

const getInitialState = (): CouponsState => {
  if (typeof window === "undefined") {
    return {
      totalPoints: 100, // Default starting points
      wonCoupons: [],
    }
  }

  const savedState = localStorage.getItem(STORAGE_KEY)
  if (!savedState) {
    return {
      totalPoints: 100,
      wonCoupons: [],
    }
  }

  try {
    return JSON.parse(savedState)
  } catch {
    return {
      totalPoints: 100,
      wonCoupons: [],
    }
  }
}

export const useCoupons = () => {
  const [state, setState] = useState<CouponsState>(getInitialState)

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Add points to the total
  const addPoints = (points: number) => {
    setState((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
    }))
  }

  // Subtract points from the total
  const subtractPoints = (points: number) => {
    setState((prev) => ({
      ...prev,
      totalPoints: Math.max(0, prev.totalPoints - points),
    }))
  }

  // Mark a coupon as won/active
  const markCouponAsWon = (couponId: number) => {
    setState((prev) => ({
      ...prev,
      wonCoupons: [...prev.wonCoupons, couponId],
    }))
  }

  // Check if a coupon is won
  const isCouponWon = (couponId: number) => {
    return state.wonCoupons.includes(couponId)
  }

  // Reset all state
  const resetState = () => {
    setState({
      totalPoints: 100,
      wonCoupons: [],
    })
  }

  return {
    totalPoints: state.totalPoints,
    wonCoupons: state.wonCoupons,
    addPoints,
    subtractPoints,
    markCouponAsWon,
    isCouponWon,
    resetState,
  }
}
