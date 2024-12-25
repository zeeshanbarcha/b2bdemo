"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ProfileDetails() {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in to view profile</div>
  }

  // Get initials for avatar fallback
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
          <h3 className="font-medium">{user.name || "No name set"}</h3>
          <p className="text-sm text-neutral-600">{user.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Wallet Balance</p>
          <p className="text-sm text-neutral-600">${user.walletBalance.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Role</p>
          <p className="text-sm text-neutral-600 capitalize">{user.role}</p>
        </div>
      </div>
      <Link href="/dashboard/settings">
        <Button className="w-full" variant="outline">
          Edit Profile
        </Button>
      </Link>
    </div>
  )
}
