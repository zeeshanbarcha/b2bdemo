"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { Badge, Loader2 } from "lucide-react"

interface UpdateWithdrawalModalProps {
  withdrawal: any
  onUpdate: () => void
}

export function UpdateWithdrawalModal({ withdrawal, onUpdate }: UpdateWithdrawalModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState("")

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/withdrawals/${withdrawal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      })

      if (!response.ok) throw new Error()
      
      toast.success(`Withdrawal ${status.toLowerCase()} successfully`)
      setOpen(false)
      onUpdate()
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} withdrawal`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Update
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Withdrawal Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-500">
                Amount: ${withdrawal.amount.toFixed(2)}
              </p>
              <p className="text-sm text-neutral-500">
                User: {withdrawal.user.name}
              </p>
              <p className="text-sm text-neutral-500">
                Email: {withdrawal.user.email}
              </p>
              <p className="text-sm text-neutral-500">
                Bank: {withdrawal.bankAccount.bankName}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Reason (required for rejection)</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                disabled={loading || !reason}
                onClick={() => handleAction('REJECTED')}
                className="flex-1"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
              </Button>
              <Button
                disabled={loading}
                onClick={() => handleAction('APPROVED')}
                className="flex-1"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 