import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentOrders = [
  { id: "'1'", product: "'T-Shirt'", date: "'2023-06-01'", status: "'Delivered'", total: "'₹179.10'" },
  { id: "'2'", product: "'Jeans'", date: "'2023-05-28'", status: "'Shipped'", total: "'₹599.00'" },
  { id: "'3'", product: "'Sneakers'", date: "'2023-05-25'", status: "'Processing'", total: "'₹1,299.00'" },
]

export function RecentOrders() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.product}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

