import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileDetails() {
  const profile = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=80",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{profile.name}</h3>
          <p className="text-sm text-neutral-600">{profile.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Phone</p>
          <p className="text-sm text-neutral-600">{profile.phone}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Address</p>
          <p className="text-sm text-neutral-600">{profile.address}</p>
        </div>
      </div>
    </div>
  )
}
