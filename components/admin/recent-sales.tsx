"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Sale {
  id: string
  user: {
    name: string
    email: string
    image: string
  }
  product: {
    price: number
  }
  quantity: number
}

export function RecentSales({ data }: { data: Sale[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
        No recent sales
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {data.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.user.image} alt="Avatar" />
            <AvatarFallback>{sale.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{sale.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {sale.user.email}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +${(sale.product.price * sale.quantity).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
} 