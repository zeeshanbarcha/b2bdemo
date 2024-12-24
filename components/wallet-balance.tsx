import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WalletBalance() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹500.00</div>
        <Button className="mt-4 w-full" variant="outline">
          Add Money
        </Button>
      </CardContent>
    </Card>
  )
}

