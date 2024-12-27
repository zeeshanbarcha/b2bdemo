"use client"

import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { usePathname } from "next/navigation"

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAdminRoute && <MainNav />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
} 