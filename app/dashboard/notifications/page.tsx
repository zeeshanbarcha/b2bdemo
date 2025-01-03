"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

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
      toast.error("Failed to fetch notifications")
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

      // Update local state
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ))
    } catch (error) {
      toast.error("Failed to mark notification as read")
    }
  }

  if (!user) {
    return <div>Please log in to view notifications</div>
  }

  if (loading) {
    return <div>Loading notifications...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-neutral-500">View your recent notifications</p>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-neutral-500">
              No notifications to display
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
                      {new Date(notification.createdAt).toLocaleDateString()}
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