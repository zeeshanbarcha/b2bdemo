import { FileQuestion } from "lucide-react"

export function NotFound({ message = "No items found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">{message}</h3>
      <p className="text-muted-foreground">Try adjusting your search or filters</p>
    </div>
  )
} 