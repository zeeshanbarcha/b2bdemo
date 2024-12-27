"use client"

import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/admin/sidebar"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-none">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 