"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { UpdateUserModal } from "./update-user-modal"

const USER_ROLES = ['USER', 'ADMIN']

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })

      if (!response.ok) throw new Error()
      
      toast.success("User role updated")
      fetchUsers()
    } catch (error) {
      toast.error("Failed to update user role")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback>
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {user.name || "No name"}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  disabled
                  value={user.role}
                  onValueChange={(value) => updateUserRole(user.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>${user.walletBalance?.toFixed(2) || "0.00"}</TableCell>
              <TableCell>{user._count?.orders || 0}</TableCell>
              <TableCell>${user.totalSpent?.toFixed(2) || "0.00"}</TableCell>
              <TableCell>
                <UpdateUserModal 
                  user={user} 
                  onUpdate={fetchUsers} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 