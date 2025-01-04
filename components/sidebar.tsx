"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, Clock, CreditCard, Download, Heart, LayoutDashboard, MessageSquare, RefreshCcw, Settings, ShoppingCart, User } from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Purchase History",
    icon: Clock,
    href: "/dashboard/purchases",
  },
  {
    label: "Downloads",
    icon: Download,
    href: "/dashboard/downloads",
  },
  {
    label: "Refund Requests",
    icon: RefreshCcw,
    href: "/dashboard/refunds",
  },
  {
    label: "Money Withdraw",
    icon: CreditCard,
    href: "/dashboard/withdraw",
  },
  {
    label: "Bank List",
    icon: BarChart,
    href: "/dashboard/banks",
  },
  {
    label: "Wishlist",
    icon: Heart,
    href: "/dashboard/wishlist",
  },
  {
    label: "Compare",
    icon: ShoppingCart,
    href: "/dashboard/compare",
  },
  {
    label: "Conversations",
    icon: MessageSquare,
    href: "/dashboard/conversations",
  },
  {
    label: "Support Ticket",
    icon: MessageSquare,
    href: "/dashboard/support",
  },
  {
    label: "Manage Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="border-r bg-white dark:bg-neutral-950">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/logo.svg" alt="netflixn" className="h-8" />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-500 transition-all hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50",
                  pathname === route.href && "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

