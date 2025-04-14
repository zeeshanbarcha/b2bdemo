import Link from "next/link"
import { Construction } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card/50 backdrop-blur border border-border">
        <CardHeader className="text-center">
          <Construction className="mx-auto h-12 w-12 text-muted-foreground" />
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
          <CardDescription>This feature is under development</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            We're working hard to bring you this feature. Please check back later.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 