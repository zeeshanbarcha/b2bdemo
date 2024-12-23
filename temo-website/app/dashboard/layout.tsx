import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

