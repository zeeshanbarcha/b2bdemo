"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { AddBankModal } from "./add-bank-modal"

interface BankAccount {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  routingNumber: string
  createdAt: Date
}

export default function BanksPage() {
  const [banks, setBanks] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    try {
      const response = await fetch('/api/user/banks')
      if (!response.ok) throw new Error()
      const data = await response.json()
      setBanks(data)
    } catch (error) {
      toast.error("Failed to fetch bank accounts")
    } finally {
      setLoading(false)
    }
  }

  const deleteBank = async (id: string) => {
    try {
      const response = await fetch(`/api/user/banks/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error()
      
      toast.success("Bank account removed")
      fetchBanks()
    } catch (error) {
      toast.error("Failed to remove bank account")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bank Accounts</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bank Account
        </Button>
      </div>

      {banks.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No bank accounts added</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You haven't added any bank accounts yet. Add one to manage your payments.
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {banks.map((bank) => (
            <Card key={bank.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {bank.bankName}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteBank(bank.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Account Name: {bank.accountName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Account Number: {bank.accountNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Routing Number: {bank.routingNumber}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddBankModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onSuccess={fetchBanks}
      />
    </div>
  )
} 