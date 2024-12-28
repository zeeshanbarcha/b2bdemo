"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

interface AddBankModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddBankModal({ open, onOpenChange, onSuccess }: AddBankModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/user/banks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error()
      
      toast.success("Bank account added successfully")
      onSuccess()
      onOpenChange(false)
      setFormData({
        bankName: "",
        accountName: "",
        accountNumber: "",
        routingNumber: ""
      })
    } catch (error) {
      toast.error("Failed to add bank account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={e => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={formData.accountName}
              onChange={e => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={e => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="routingNumber">Routing Number</Label>
            <Input
              id="routingNumber"
              value={formData.routingNumber}
              onChange={e => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Bank Account"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 