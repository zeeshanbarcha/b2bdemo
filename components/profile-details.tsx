import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ProfileDetails() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src="/placeholder.svg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="text-lg font-semibold">John Doe</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">john.doe@example.com</p>
      </div>
      <div className="w-full space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Member Since:</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">January 1, 2023</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Total Orders:</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">12</span>
        </div>
      </div>
      <Button className="w-full">Edit Profile</Button>
    </div>
  )
}

