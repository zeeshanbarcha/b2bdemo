"use client"
// Start of Selection

import { createContext, useContext, useEffect, useState } from "react"
import { encryptData, decryptData } from "../lib/crypto"
import { handleLogout } from "@/app/actions/user"
import { getCartCount, getWishlistCount } from "@/app/actions/cart"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  walletBalance: number
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  cartCount: number
  wishlistCount: number
  refreshUser: () => Promise<void>
  refreshCounts: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  const refreshCounts = async () => {
    if (!user) return
    const [cart, wishlist] = await Promise.all([
      getCartCount(),
      getWishlistCount()
    ])
    setCartCount(cart)
    setWishlistCount(wishlist)
  }

  useEffect(() => {
    if (user) {
      refreshCounts()
    } else {
      setCartCount(0)
      setWishlistCount(0)
    }
  }, [user])

  useEffect(() => {
    // Load user from localStorage on mount
    const encryptedUser = localStorage.getItem('user')
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser)
      setUser(decryptedUser)
    }
  }, [])

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser)
    if (newUser) {
      try {
        const encryptedUser = encryptData(newUser)
        localStorage.setItem('user', encryptedUser)
      } catch (error) {
        console.error('Error encrypting user data:', error)
        localStorage.removeItem('user')
      }
    } else {
      localStorage.removeItem('user')
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("user")
    window.location.href = "/"
    await handleLogout()
  }

  const refreshUser = async () => {
    try {
      // Fetch updated user data
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/session')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const session = await response.json()
      
      if (session?.user) {
        // Update state and localStorage
        handleSetUser(session.user)
      } else {
        // Clear both state and storage if no user data
        handleSetUser(null)
      }
      
      return session?.user
    } catch (error) {
      console.error('Error refreshing user:', error)
      // On error, clear user data to prevent stale state
      handleSetUser(null)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      logout,
      cartCount,
      wishlistCount,
      refreshUser,
      refreshCounts
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 