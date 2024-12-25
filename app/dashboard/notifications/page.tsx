"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function NotificationsPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in to view notifications</div>
  }

  const notifications = [
    {
      id: 1,
      title: "Order Status Update",
      message: "Your order #1234 has been shipped",
      date: "2 hours ago",
      type: "order",
      read: false,
    },
    {
      id: 2,
      title: "Special Offer",
      message: "Get 20% off on your next purchase",
      date: "1 day ago",
      type: "promotion",
      read: true,
    },
    {
      id: 3,
      title: "Account Security",
      message: "New login detected from your account",
      date: "2 days ago",
      type: "security",
      read: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-neutral-500">
          Manage your notification preferences and view updates
        </p>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className={`mt-1 rounded-full p-2 ${notification.read ? 'bg-neutral-100' : 'bg-blue-100'}`}>
                <Bell className={`h-4 w-4 ${notification.read ? 'text-neutral-500' : 'text-blue-500'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{notification.title}</h3>
                  <span className="text-sm text-neutral-500">{notification.date}</span>
                </div>
                <p className="text-sm text-neutral-600">{notification.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-neutral-500">Get updates via email</p>
              </div>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-neutral-500">Get updates via SMS</p>
              </div>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 