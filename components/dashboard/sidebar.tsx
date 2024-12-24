"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
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
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.title}
        </Link>
      ))}
    </div>
  )
}
