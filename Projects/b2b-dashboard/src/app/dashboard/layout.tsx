import type { Metadata } from "next"

import { Sidebar } from "@/components/sidebar"

export const metadata: Metadata = {
  title: "Dashboard | B2BDemo",
  description: "Example crypto trading dashboard",
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

