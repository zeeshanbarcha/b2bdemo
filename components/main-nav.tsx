"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export function MainNav() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()
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
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold">7-Eleven</span>
            </Link>
            <div className="hidden lg:flex lg:gap-6">
              <Link
                href="/products"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Deals
              </Link>
            </div>
          </div>

          <div className="hidden flex-1 lg:block lg:max-w-md xl:max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-9 pr-4"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard/wishlist"
                  className="hidden h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 lg:flex"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="hidden h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 lg:flex"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="hidden h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 lg:flex"
                >
                  <Bell className="h-5 w-5" />
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
                        <p className="text-xs leading-none text-neutral-500">
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
                      className="text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="whitespace-nowrap"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  )
}
