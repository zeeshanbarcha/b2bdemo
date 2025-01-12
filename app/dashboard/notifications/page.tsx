"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

interface Notification {
  id: string
  title: string
  message: string
  createdAt: string
  read: boolean
  type: string
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/notifications')
      if (!response.ok) throw new Error()
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      toast.error(t.common.error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) throw new Error()

      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ))
    } catch (error) {
      toast.error(t.dashboard.failedToMarkAsRead)
    }
  }

  if (!user) {
    return <div>{t.auth.pleaseLogin}</div>
  }

  if (loading) {
    return <div>{t.common.loading}</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t.dashboard.notifications}</h1>
        <p className="text-neutral-500">{t.dashboard.viewNotifications}</p>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-neutral-500">
              {t.dashboard.noNotifications}
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? 'opacity-60' : ''}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="flex items-start gap-4 p-4 cursor-pointer">
                <div className="rounded-full bg-blue-100 p-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-sm text-neutral-500">
                      {new Date(notification.createdAt).toLocaleDateString(language)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{notification.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 