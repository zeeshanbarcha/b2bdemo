"use client"

import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export function SignOutButton() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
    toast.success('Logged out successfully')
  }

  return (
    <button
      className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  )
}