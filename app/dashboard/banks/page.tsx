"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { AddBankModal } from "./add-bank-modal"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

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
  const { language } = useLanguage()
  const t = translations[language];

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
      toast.error(t.dashboard.banks.fetchError)
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
      
      toast.success(t.dashboard.banks.removeSuccess)
      fetchBanks()
    } catch (error) {
      toast.error(t.dashboard.banks.removeError)
    }
  }

  if (loading) return <div>{t.common.loading}</div>

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t.dashboard.banks.title}</h2>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t.dashboard.banks.addBank}
        </Button>
      </div>

      {banks.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center md:min-h-[400px] md:p-8">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Building2 className="h-8 w-8 text-muted-foreground md:h-10 md:w-10" />
            <h3 className="mt-4 text-base font-semibold md:text-lg">{t.dashboard.banks.noBanks}</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {t.dashboard.banks.noBanksDesc}
            </p>
            <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {t.dashboard.banks.addBank}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {banks.map((bank) => (
            <Card key={bank.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium line-clamp-1">
                  {bank.bankName}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteBank(bank.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t.dashboard.banks.accountName}:</span> {bank.accountName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t.dashboard.banks.accountNumber}:</span> {bank.accountNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t.dashboard.banks.routingNumber}:</span> {bank.routingNumber}
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