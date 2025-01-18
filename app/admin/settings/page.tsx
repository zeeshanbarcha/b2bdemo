"use client"

import { useEffect } from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const [withdrawalThreshold, setWithdrawalThreshold] = useState(17.33)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (!response.ok) throw new Error()
        const data = await response.json()
        setWithdrawalThreshold(data.withdrawalThreshold)
      } catch (error) {
        toast.error("Failed to fetch settings")
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalThreshold })
      })

      if (!response.ok) throw new Error()
      toast.success("Settings updated successfully")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-neutral-500">Manage system-wide settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdrawalThreshold">
                Minimum Withdrawal Amount ($)
              </Label>
              <Input
                id="withdrawalThreshold"
                type="number"
                min="0"
                step="0.01"
                value={withdrawalThreshold}
                onChange={(e) => setWithdrawalThreshold(Number(e.target.value))}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 