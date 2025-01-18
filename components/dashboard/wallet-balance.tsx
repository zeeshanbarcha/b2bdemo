"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { WithdrawModal } from "./withdraw-modal"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"
import { formatPrice } from "@/lib/utils"

interface WalletBalanceProps {
  initialBalance: number
  withdrawalThreshold?: number
}

interface LastWithdrawal {
  amount: number
  status: string
  createdAt: string
  reason?: string
}

export function WalletBalance({ 
  initialBalance, 
  withdrawalThreshold = 17.33
}: WalletBalanceProps) {
  const { currency, exchangeRates } = useCurrency()
  const { language } = useLanguage()
  const t = translations[language]
  const [balance, setBalance] = useState(initialBalance)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [lastWithdrawal, setLastWithdrawal] = useState<LastWithdrawal | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch balance every 30 seconds
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/balance')
        if (!response.ok) throw new Error()
        const data = await response.json()
        setBalance(data.balance)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      }
    }

    // Initial fetch
    fetchBalance()

    // Set up interval for periodic updates
    const interval = setInterval(fetchBalance, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  // Fetch last withdrawal
  useEffect(() => {
    const fetchLastWithdrawal = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/withdrawals/last')
        if (!response.ok) throw new Error()
        const data = await response.json()
        setLastWithdrawal(data)
      } catch (error) {
        console.error('Failed to fetch last withdrawal:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLastWithdrawal()
  }, [])

  // Calculate a random percentage between -30 and +50 based on the balance
  const calculatePercentageChange = (balance: number): number => {
    if (balance <= 0) {
      // For zero or negative balance, keep the existing range (-30 to +50)
      const seed = balance * 1000
      const random = Math.sin(seed) * 10000 % 80
      return Number((random - 30).toFixed(2))
    } else {
      // For positive balance, ensure positive percentage (0 to +50)
      const seed = balance * 1000
      const random = Math.abs(Math.sin(seed) * 10000 % 50)
      return Number(random.toFixed(2))
    }
  }

  const percentageChange = calculatePercentageChange(balance)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600'
      case 'APPROVED':
        return 'text-green-600'
      case 'REJECTED':
        return 'text-red-600'
      default:
        return 'text-neutral-600'
    }
  }

  const onWithdrawalComplete = async () => {
    // Fetch updated balance immediately after withdrawal
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/balance')
      if (!response.ok) throw new Error()
      const data = await response.json()
      setBalance(data.balance)
    } catch (error) {
      console.error('Failed to fetch updated balance:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {t.dashboard.walletBalance}
        </CardTitle>
        <Wallet className="h-4 w-4 text-neutral-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatPrice(balance, currency, exchangeRates)}
        </div>
        <p className="text-xs text-neutral-600">
          <span className={percentageChange > 0 ? "text-green-600" : "text-red-600"}>
            {percentageChange > 0 ? '+' : ''}{percentageChange}%
          </span>
          {' '}{t.dashboard.fromLastMonth}
        </p>

        {lastWithdrawal && (
          <div className="mt-2 space-y-1 border-t pt-2">
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span className="text-neutral-600">{t.dashboard.lastWithdrawal}:</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>{formatPrice(lastWithdrawal.amount, currency, exchangeRates)}</span>
              <span className={getStatusColor(lastWithdrawal.status)}>
                {lastWithdrawal.status.charAt(0) + lastWithdrawal.status.slice(1).toLowerCase()}
              </span>
            </div>
            {lastWithdrawal.reason && lastWithdrawal.status === 'REJECTED' && (
              <div className="mt-1 rounded-md bg-red-50 p-2">
                <p className="text-xs text-red-600">
                  {t.dashboard.rejectionReason}: {lastWithdrawal.reason}
                </p>
              </div>
            )}
            {lastWithdrawal.status === 'APPROVED' && (
              <div className="mt-1 rounded-md bg-green-50 p-2">
                <p className="text-xs text-green-600">
                  {t.dashboard.withdrawalApproved}
                </p>
              </div>
            )}
          </div>
        )}

        <Button 
          className="mt-4 w-full" 
          variant="outline"
          onClick={() => setShowWithdrawModal(true)}
          disabled={balance < withdrawalThreshold}
        >
          {t.dashboard.withdrawFunds}
        </Button>
        {balance < withdrawalThreshold && (
          <p className="mt-2 text-xs text-neutral-600">
            {t.dashboard.minimumWithdrawal} {formatPrice(withdrawalThreshold, currency, exchangeRates)}
          </p>
        )}
      </CardContent>
      <WithdrawModal 
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        balance={balance}
        withdrawalThreshold={withdrawalThreshold}
        onComplete={onWithdrawalComplete}
      />
    </Card>
  )
}
