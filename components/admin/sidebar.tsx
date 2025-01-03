"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ArrowLeft,
  Settings,
  Banknote,
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Products",
    icon: Package,
    href: "/admin/products",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    label: "Withdrawals",
    icon: Banknote,
    href: "/admin/withdrawals",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Link>
      </div>
    </div>
  )
} 