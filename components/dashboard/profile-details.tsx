"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

export function ProfileDetails() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]?.dashboard?.profile || {}

  if (!user) {
    return <div>{t.pleaseLogin}</div>
  }

  const initials = user.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image || ""} alt={user.name || ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{user.name || t.noName}</h3>
          <p className="text-sm text-neutral-600">{user.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">{t.phone}</p>
          <p className="text-sm text-neutral-600">{user.phone || t.phoneNotSet}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{t.address}</p>
          <p className="text-sm text-neutral-600">
            {user.address ? (
              <>
                {user.address}
                {user.city && `, ${user.city}`}
                {user.state && `, ${user.state}`}
                {user.zipCode && ` ${user.zipCode}`}
                {user.country && `, ${user.country}`}
              </>
            ) : (
              t.addressNotSet
            )}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">{t.walletBalance}</p>
          <p className="text-sm text-neutral-600">${user.walletBalance.toFixed(2)}</p>
        </div>
      </div>
      <Link href="/dashboard/settings">
        <Button className="w-full" variant="outline">
          {t.editProfile}
        </Button>
      </Link>
    </div>
  )
}
