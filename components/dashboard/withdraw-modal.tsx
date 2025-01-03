import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  balance: number
  withdrawalThreshold: number
  onComplete?: () => void
}

export function WithdrawModal({ open, onOpenChange, balance, withdrawalThreshold, onComplete }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [bankId, setBankId] = useState("")
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/banks`)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setBanks(data)
    } catch (error) {
      toast.error("Failed to fetch bank accounts")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankId) {
      toast.error("Please select a bank account")
      return
    }

    const withdrawAmount = parseFloat(amount)
    if (withdrawAmount < withdrawalThreshold) {
      toast.error(`Minimum withdrawal amount is $${withdrawalThreshold}`)
      return
    }

    if (withdrawAmount > balance) {
      toast.error("Insufficient balance")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: withdrawAmount, bankAccountId: bankId })
      })

      if (!response.ok) throw new Error()
      toast.success("Withdrawal request submitted")
      onOpenChange(false)
      onComplete?.()
    } catch (error) {
      toast.error("Failed to submit withdrawal request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Bank Account</Label>
            <Select value={bankId} onValueChange={setBankId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank: any) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.bankName} - {bank.accountNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              min={withdrawalThreshold}
              max={balance}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit Withdrawal Request"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 