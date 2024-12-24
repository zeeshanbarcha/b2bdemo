export function RecentOrders() {
  const orders = [
    {
      id: "1",
      product: "Classic White T-Shirt",
      date: "2024-01-23",
      status: "Delivered",
      total: "$29.99",
    },
    {
      id: "2",
      product: "Denim Jeans",
      date: "2024-01-22",
      status: "In Transit",
      total: "$79.99",
    },
    {
      id: "3",
      product: "Leather Jacket",
      date: "2024-01-20",
      status: "Processing",
      total: "$199.99",
    },
  ]

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="space-y-1">
            <p className="font-medium">{order.product}</p>
            <p className="text-sm text-neutral-600">{order.date}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{order.total}</p>
            <p className="text-sm text-neutral-600">{order.status}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
