"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, Heart, Bell, LayoutDashboard, ShoppingBag, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthModal } from "./auth-modal"

export function MainNav() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <span className="sr-only">Daraz</span>
            <ShoppingBag className="h-8 w-8 text-primary-500" />
          </Link>
          <div className="hidden flex-1 md:mx-8 md:block lg:mx-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                type="search"
                placeholder="I am shopping for..."
                className="w-full max-w-md pl-10"
              />
            </div>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:inline-flex"
            >
              Sign in
            </Button>
          </nav>
        </div>
        {!isDashboard && (
          <div className="border-t bg-neutral-50">
            <div className="mx-auto flex h-12 max-w-7xl items-center gap-6 overflow-x-auto px-6 lg:px-8">
              <Link
                href="/products?category=electronics"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                Electronics
              </Link>
              <Link
                href="/products?category=fashion"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                Fashion
              </Link>
              <Link
                href="/products?category=home"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                Home
              </Link>
              <Link
                href="/products?category=beauty"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                Beauty
              </Link>
              <Link
                href="/products?category=sports"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                Sports
              </Link>
            </div>
          </div>
        )}
      </header>
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </>
  )
}
