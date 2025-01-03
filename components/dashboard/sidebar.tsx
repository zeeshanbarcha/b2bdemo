"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
  Bell,
  Building2 as Bank,
} from "lucide-react"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Banks List",
    href: "/dashboard/banks",
    icon: Bank,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-1">
      {sidebarLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
            pathname === link.href
              ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.title}
        </Link>
      ))}
    </div>
  )
}
