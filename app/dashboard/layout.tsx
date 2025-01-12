"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { SignOutButton } from "@/components/sign-out-button"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleCloseSidebar = () => setSidebarOpen(false)
    document.addEventListener('closeSidebar', handleCloseSidebar)
    return () => document.removeEventListener('closeSidebar', handleCloseSidebar)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-[64px] left-0 z-40 w-full transform border-r border-border bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:w-80 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          {/* Close button positioned at top-right */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="overflow-y-auto px-4 py-6 lg:px-6 lg:py-8">
            <Sidebar />
          </div>
          <div className="border-t border-border p-4 lg:p-6">
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-16 z-50 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background/30 dark:bg-background/5">
        <div className="mx-auto h-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
