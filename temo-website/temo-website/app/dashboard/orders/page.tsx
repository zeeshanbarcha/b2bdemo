import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ArrowUpDown } from "lucide-react"

const orders = [
  {
    id: "ORD001",
    date: "2024-01-23",
    status: "Delivered",
    total: "$29.99",
    items: [
      {
        name: "Classic White T-Shirt",
        quantity: 1,
        price: "$29.99",
      },
    ],
  },
  {
    id: "ORD002",
    date: "2024-01-22",
    status: "In Transit",
    total: "$79.99",
    items: [
      {
        name: "Denim Jeans",
        quantity: 1,
        price: "$79.99",
      },
    ],
  },
  {
    id: "ORD003",
    date: "2024-01-20",
    status: "Processing",
    total: "$199.99",
    items: [
      {
        name: "Leather Jacket",
        quantity: 1,
        price: "$199.99",
      },
    ],
  },
]

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-neutral-500">Manage your orders and track deliveries</p>
        </div>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Order #{order.id}
              </CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-500">{order.date}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "In Transit"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-neutral-400" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-neutral-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">{item.price}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t pt-4">
                  <p className="font-medium">Total</p>
                  <p className="font-bold">{order.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
