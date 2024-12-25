"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="hidden w-80 border-r bg-neutral-50/50 lg:block">
        <div className="flex h-full flex-col justify-between">
          <div className="overflow-y-auto px-6 py-8">
            <Sidebar />
          </div>
          <div className="border-t p-6">
            <SignOutButton />
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto bg-neutral-50/30">
        <div className="mx-auto h-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
