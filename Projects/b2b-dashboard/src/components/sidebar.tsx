"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  Building2,
  CircleDollarSign,
  Coins,
  Gift,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { pb } from "@/lib/pocketbase"

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Wallets",
    icon: Wallet,
    href: "/dashboard/wallets",
  },
  {
    title: "Platforms",
    icon: Building2,
    href: "/dashboard/platforms",
    children: [
      { title: "MT5", href: "/dashboard/platforms/mt5" },
      { title: "cTrader", href: "/dashboard/platforms/ctrader" },
    ],
  },
  {
    title: "Funds",
    icon: CircleDollarSign,
    href: "/funds",
    children: [
      { title: "Deposit", href: "/dashboard/funds/deposit" },
      { title: "Withdraw", href: "/dashboard/funds/withdraw" },
      { title: "Transfer", href: "/dashboard/funds/transfer" },
      { title: "Internal Transfer", href: "/dashboard/funds/internal-transfer" },
    ],
  },
  { title: "Exchange", icon: Coins, href: "/dashboard/exchange" },
  { title: "B2Copy", icon: Users, href: "/dashboard/b2copy" },
  { title: "MAM", icon: Briefcase, href: "/dashboard/mam" },
  { title: "Transaction History", icon: History, href: "/dashboard/history" },
  { title: "Bonuses", icon: Gift, href: "/dashboard/bonuses" },
  { title: "Helpdesk", icon: HelpCircle, href: "/dashboard/helpdesk" },
  { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (href: string) => {
    // List of implemented routes
    const implementedRoutes = [
      "/dashboard",
      "/dashboard/wallets",
      "/dashboard/platforms/mt5",
      "/dashboard/platforms/ctrader",
      "/dashboard/funds/deposit",
      "/dashboard/funds/withdraw",
      "/dashboard/funds/transfer",
      "/dashboard/funds/internal-transfer"
    ]

    if (implementedRoutes.includes(href)) {
      router.push(href)
    } else {
      router.push("/coming-soon")
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
          <Coins className="h-6 w-6" />
          <span>B2BDEMO</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <div key={link.title}>
              <Button
                className="w-full justify-start"
                variant={pathname === link.href ? "secondary" : "ghost"}
                onClick={() => handleNavigation(link.href)}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
              </Button>
              {link.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {link.children.map((child) => (
                    <Button
                      key={child.title}
                      className="w-full justify-start"
                      variant={pathname === child.href ? "secondary" : "ghost"}
                      onClick={() => handleNavigation(child.href)}
                    >
                      {child.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
        <Button
          className="w-full justify-start text-destructive"
          variant="ghost"
          onClick={() => {
            pb.authStore.clear()
            router.push('/auth/sign-in')
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

