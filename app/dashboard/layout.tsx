"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { SignOutButton } from "@/components/sign-out-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="hidden w-80 border-r border-border bg-background/50 lg:block dark:bg-background/10">
        <div className="flex h-full flex-col justify-between">
          <div className="overflow-y-auto px-6 py-8">
            <Sidebar />
          </div>
          <div className="border-t border-border p-6">
            <SignOutButton />
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto bg-background/30 dark:bg-background/5">
        <div className="mx-auto h-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
