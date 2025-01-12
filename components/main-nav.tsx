"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"
import { 
  Store, 
  Grid2x2, 
  Tags, 
  ShoppingCart, 
  Bell, 
  LayoutDashboard,
} from "lucide-react"

export function MainNav() {
  const { user, logout, cartCount } = useAuth()
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language]

  const handleLogout = async () => {
    logout()
    router.push('/')
    toast.success(t.common.messages.logoutSuccess)
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
              <span className="text-xl font-bold text-foreground">Netflixin</span>
            </Link>
            <div className="hidden lg:flex lg:gap-6">
              <Link href="/products" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <Store className="h-4 w-4" />
                <span>{t.nav.products}</span>
              </Link>
              <Link href="/categories" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <Grid2x2 className="h-4 w-4" />
                <span>{t.nav.categories}</span>
              </Link>
              <Link href="/deals" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <Tags className="h-4 w-4" />
                <span>{t.nav.deals}</span>
              </Link>
            </div>
          </div>

          <div className="hidden flex-1 lg:block lg:max-w-md xl:max-w-lg">
            <SearchComponent />
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <LanguageSelector />
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
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex w-full items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t.nav.dashboard}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="w-full">
                        {t.nav.account.settings}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                      {t.nav.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/sign-in">
                  <Button variant="ghost">{t.nav.signIn}</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>{t.nav.signUp}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
