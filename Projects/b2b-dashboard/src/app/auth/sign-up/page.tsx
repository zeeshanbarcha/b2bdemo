"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { pb } from "@/lib/pocketbase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      passwordConfirm: formData.get("password") as string,
      name: `${formData.get("first-name")} ${formData.get("last-name")}`,
      phoneNumber: formData.get("phone") as string,
      emailVisibility: true,
      verified: false,
      userStatus: "active"
    }

    try {
      await pb.collection('users').create(data)
      await pb.collection('users').requestVerification(data.email)
      router.push("/auth/sign-in?verified=pending")
    } catch (error) {
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card/50 backdrop-blur border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Enter Account Details</CardTitle>
          <CardDescription>Create your B2BDemo account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="Enter First Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Enter Last Name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter Email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <Select defaultValue="+44">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="flex-1" id="phone" placeholder="Enter Phone number" type="tel" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
              <ul className="text-xs text-muted-foreground">
                <li>• 8 symbols</li>
                <li>• 1 lower-case letter</li>
                <li>• 1 number</li>
                <li>
                  • 1 special character: !@#$%^&*()_+-=[]{}|;:,{"<>"}?/{" "}
                </li>
                <li>• 1 upper-case letter</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label className="text-sm" htmlFor="terms">
                  I agree with{" "}
                  <Link className="text-primary underline-offset-4 hover:underline" href="#">
                    B2Core Customer Agreement
                  </Link>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="adult" />
                <Label className="text-sm" htmlFor="adult">
                  I am an adult
                </Label>
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

