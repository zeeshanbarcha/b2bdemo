"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

interface AddBankModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddBankModal({ open, onOpenChange, onSuccess }: AddBankModalProps) {
  const { language } = useLanguage()
  const t = translations[language]
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
      
      toast.success(t.dashboard.banks.addSuccess)
      onSuccess()
      onOpenChange(false)
      setFormData({
        bankName: "",
        accountName: "",
        accountNumber: "",
        routingNumber: ""
      })
    } catch (error) {
      toast.error(t.dashboard.banks.addError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.dashboard.banks.addBank}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">{t.dashboard.banks.form.bankNameLabel}</Label>
            <Input
              id="bankName"
              placeholder={t.dashboard.banks.form.bankNamePlaceholder}
              value={formData.bankName}
              onChange={e => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">{t.dashboard.banks.form.accountNameLabel}</Label>
            <Input
              id="accountName"
              placeholder={t.dashboard.banks.form.accountNamePlaceholder}
              value={formData.accountName}
              onChange={e => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">{t.dashboard.banks.form.accountNumberLabel}</Label>
            <Input
              id="accountNumber"
              placeholder={t.dashboard.banks.form.accountNumberPlaceholder}
              value={formData.accountNumber}
              onChange={e => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="routingNumber">{t.dashboard.banks.form.routingNumberLabel}</Label>
            <Input
              id="routingNumber"
              placeholder={t.dashboard.banks.form.routingNumberPlaceholder}
              value={formData.routingNumber}
              onChange={e => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.dashboard.banks.addBank
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 