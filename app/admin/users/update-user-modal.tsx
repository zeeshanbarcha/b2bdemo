import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

interface UpdateUserModalProps {
  user: {
    id: string
    email: string
    walletBalance: number
  }
  onUpdate: () => void
}

export function UpdateUserModal({ user, onUpdate }: UpdateUserModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: user.email,
    password: "",
    walletBalance: user.walletBalance
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error()
      
      toast.success("User updated successfully")
      onUpdate()
      setOpen(false)
    } catch (error) {
      toast.error("Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletBalance">Wallet Balance</Label>
            <Input
              id="walletBalance"
              type="number"
              value={formData.walletBalance}
              onChange={e => setFormData(prev => ({ ...prev, walletBalance: parseFloat(e.target.value) }))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update User"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 