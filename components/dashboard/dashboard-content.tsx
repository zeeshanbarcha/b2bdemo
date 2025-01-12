"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { WalletBalance } from "@/components/dashboard/wallet-balance"
import { ProfileDetails } from "@/components/dashboard/profile-details"
import { Suspense, useEffect, useState } from "react"
import { getCartCount, getWishlistCount } from "@/app/actions/cart"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

export function DashboardContent() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [withdrawalThreshold, setWithdrawalThreshold] = useState(1500)
  const { user } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const fetchCounts = async () => {
      const [cartTotal, wishlistTotal] = await Promise.all([
        getCartCount(),
        getWishlistCount()
      ])
      setCartCount(cartTotal)
      setWishlistCount(wishlistTotal)
    }
    fetchCounts()
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (!response.ok) throw new Error()
        const data = await response.json()
        setWithdrawalThreshold(data.withdrawalThreshold)
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t.dashboard.dashboard}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WalletBalance 
          initialBalance={user?.walletBalance || 0} 
          withdrawalThreshold={withdrawalThreshold}
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.orders}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cartCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.wishlist}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlistCount}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t.dashboard.recentOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<OrdersSkeleton />}>
              <RecentOrders />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t.dashboard.manageProfile}</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ProfileSkeleton />}>
              <ProfileDetails />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-12 w-12 rounded bg-gray-200 animate-pulse" />
          <div className="space-y-1 flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  )
} 