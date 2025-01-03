"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UpdateWithdrawalModal } from "./update-withdrawal-modal"
import { toast } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"

interface Withdrawal {
  id: string
  amount: number
  status: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  bankAccount: {
    bankName: string
    accountNumber: string
  }
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/admin/withdrawals')
      if (!response.ok) throw new Error()
      const data = await response.json()
      setWithdrawals(data)
    } catch (error) {
      toast.error("Failed to fetch withdrawals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
        <p className="text-neutral-500">Manage user withdrawal requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{withdrawal.user.name}</div>
                      <div className="text-sm text-neutral-500">{withdrawal.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{withdrawal.bankAccount.bankName}</div>
                      <div className="text-sm text-neutral-500">****{withdrawal.bankAccount.accountNumber.slice(-4)}</div>
                    </div>
                  </TableCell>
                  <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(withdrawal.status)}>
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {withdrawal.status === 'PENDING' && (
                      <UpdateWithdrawalModal
                        withdrawal={withdrawal}
                        onUpdate={fetchWithdrawals}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 