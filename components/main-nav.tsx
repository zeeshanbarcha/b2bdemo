"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Search as SearchComponent } from "@/components/search"
import { ThemeToggle } from "./theme-toggle"
import { CurrencySelector } from "./currency-selector"

export function MainNav() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout, cartCount } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    logout()
    router.push('/')
    toast.success('Logged out successfully')
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-foreground">7-Eleven</span>
            </Link>
            <div className="hidden lg:flex lg:gap-6">
              <Link
                href="/products"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Deals
              </Link>
            </div>
          </div>

          <div className="hidden flex-1 lg:block lg:max-w-md xl:max-w-lg">
            <SearchComponent />
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <CurrencySelector />
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  href="/dashboard/orders"
                  className="relative hidden h-9 w-9 items-center justify-center rounded-md hover:bg-accent lg:flex"
                >
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="hidden h-9 w-9 items-center justify-center rounded-md hover:bg-accent lg:flex"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="w-full">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  )
}
