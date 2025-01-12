"use client"

import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

export function SignOutButton() {
  const { logout } = useAuth()
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language]?.common || translations.en.common
  const nav = translations[language]?.nav || translations.en.nav

  const handleLogout = () => {
    logout()
    router.push('/')
    toast.success(t.messages.logoutSuccess)
  }

  return (
    <button
      className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      {nav.logout}
    </button>
  )
}