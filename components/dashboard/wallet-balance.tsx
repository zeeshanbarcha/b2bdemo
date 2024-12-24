import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"

export function WalletBalance() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Wallet Balance
        </CardTitle>
        <Wallet className="h-4 w-4 text-neutral-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$250.00</div>
        <p className="text-xs text-neutral-600">
          +20% from last month
        </p>
      </CardContent>
    </Card>
  )
}
