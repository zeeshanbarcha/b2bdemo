"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Bell } from "'lucide-react'"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthModal } from "./auth/auth-modal"

export function MainNav() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-neutral-950">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6">
            <img src="/logo.svg" alt="7-Eleven" className="h-8" />
          </Link>
          <div className="flex-1 md:max-w-sm lg:max-w-lg">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                type="search"
                placeholder="I am shopping for..."
                className="pl-8"
              />
            </div>
          </div>
          <nav className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthModal(true)}
            >
              Sign in
            </Button>
          </nav>
        </div>
        <div className="border-t bg-neutral-100/50 dark:bg-neutral-800/50">
          <div className="container flex h-12 items-center">
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" size="sm">
                Home
              </Button>
              <Button variant="ghost" size="sm">
                Flash Sale
              </Button>
              <Button variant="ghost" size="sm">
                All products
              </Button>
              <Button variant="ghost" size="sm">
                All categories
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </>
  )
}

