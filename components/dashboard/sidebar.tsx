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
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

export function Sidebar() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = translations[language]

  const sidebarLinks = [
    {
      title: t.dashboard.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t.dashboard.orders,
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: t.dashboard.wishlist,
      href: "/dashboard/wishlist",
      icon: Heart,
    },
    {
      title: t.dashboard.notifications,
      href: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: t.dashboard.bankList,
      href: "/dashboard/banks",
      icon: Bank,
    },
    {
      title: t.dashboard.settingsLink,
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex flex-col gap-1">
      {sidebarLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:bg-accent focus:text-accent-foreground focus:outline-none",
            pathname === link.href
              ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
              : "text-muted-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
          )}
          onClick={() => typeof window !== 'undefined' && window.innerWidth < 1024 && document.dispatchEvent(new Event('closeSidebar'))}
        >
          <link.icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{link.title}</span>
        </Link>
      ))}
    </div>
  )
}
