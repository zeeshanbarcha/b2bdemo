"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { pb } from "@/lib/pocketbase"
import Link from "next/link"
import { QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await pb.collection('users').authWithPassword(email, password)
      console.log(pb.authStore.isValid)
      
      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh() // Add this to ensure the UI updates
      
    } catch (error) {
      console.error('Auth error:', error)
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card/50 backdrop-blur border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to B2BDemo</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="text-sm text-destructive text-center">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                placeholder="name@example.com" 
                type="email" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                required 
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              <Link className="text-primary underline-offset-4 hover:underline" href="/auth/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                  <h3 className="font-semibold">Log in with QR-code</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan the code with Our App and sign in instantly
                  </p>
                </div>
                <div className="flex h-48 w-48 items-center justify-center rounded-lg border border-border bg-muted/50">
                  <QrCode className="h-32 w-32 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Not a member?{" "}
              <Link className="text-primary underline-offset-4 hover:underline" href="/auth/sign-up">
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

