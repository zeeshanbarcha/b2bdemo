"use client"
// Start of Selection

import { createContext, useContext, useEffect, useState } from "react"
import { encryptData, decryptData } from "../lib/crypto"
import { handleLogout } from "@/app/actions/user"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  walletBalance: number
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

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
      const encryptedUser = encryptData(newUser)
      localStorage.setItem('user', encryptedUser)
    } else {
      localStorage.removeItem('user')
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("user")
    await handleLogout()
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout }}>
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