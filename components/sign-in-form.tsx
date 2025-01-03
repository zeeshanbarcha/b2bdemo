"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { loginSchema, type LoginFormData } from "@/app/validations/auth"
import { useAuth } from "@/contexts/auth-context"

interface SignInFormProps {
  onSuccess: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.status === 404) {
        toast.error(result.message)
        return
      }

      if (result.status === 201 && result.user) {
        console.log(result.user)
        setUser(result.user)
        toast.success(result.message)
        reset()
        onSuccess()
        router.refresh()
        result.user.role === 'ADMIN' ? router.push('/admin') : router.push('/dashboard')
      } else {
        toast.error('Invalid response from server')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register('email')}
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register('password')}
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}

