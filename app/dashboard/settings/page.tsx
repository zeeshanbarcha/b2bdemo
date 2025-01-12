"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect, Suspense } from "react"
import { toast } from "react-hot-toast"
import { updateUser } from "@/app/actions/user"
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { settingsSchema, type SettingsFormData } from "@/app/validations/settings"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]?.dashboard?.settings || translations?.en?.dashboard.settings
  const commonT = translations[language]?.common || translations.en.common
  const authT = translations[language]?.auth || translations.en.auth

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm<SettingsFormData>({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      image: ""
    }
  })

  useEffect(() => {
    if (user) {
      const [firstName = "", lastName = ""] = user.name?.split(" ") || []
      
      // Batch set form values for better performance
      const values = {
        firstName,
        lastName,
        email: user.email,
        image: user.image || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || ""
      }
      
      Object.entries(values).forEach(([key, value]) => {
        setValue(key as keyof SettingsFormData, value)
      })
    }
  }, [user, setValue])

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setLoading(true)
      const result = await updateUser({
        ...data,
        image: watch("image")
      })
      
      if (result.success) {
        toast.success(t.messages.updateSuccess)
        
        // First update the local form state
        if (result.data) {
          const [firstName = "", lastName = ""] = result.data.name?.split(" ") || []
          Object.entries({
            firstName,
            lastName,
            email: result.data.email,
            image: result.data.image || "",
            phone: result.data.phone || "",
            address: result.data.address || "",
            city: result.data.city || "",
            state: result.data.state || "",
            zipCode: result.data.zipCode || "",
            country: result.data.country || ""
          }).forEach(([key, value]) => {
            setValue(key as keyof SettingsFormData, value)
          })
        }
        
        // Then refresh the global user state
        await refreshUser()
      } else {
        toast.error(result.error || t.messages.updateError)
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error(t.messages.updateError)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.messages.uploadError.size)
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error(t.messages.uploadError.type)
      return
    }

    try {
      setImageLoading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      
      if (!data.url) {
        throw new Error("No URL returned from upload")
      }

      // Set the image URL in the form
      setValue("image", data.url)
      
      // Update user profile with new image URL
      const result = await updateUser({
        firstName: watch("firstName"),
        lastName: watch("lastName"),
        email: watch("email"),
        phone: watch("phone"),
        address: watch("address"),
        city: watch("city"),
        state: watch("state"),
        zipCode: watch("zipCode"),
        country: watch("country"),
        image: data.url
      })

      if (result.success) {
        toast.success(t.messages.pictureSuccess)
        await refreshUser() // Wait for the refresh to complete
        
        // Re-set form values after refresh to ensure consistency
        if (result.data) {
          const [firstName = "", lastName = ""] = result.data.name?.split(" ") || []
          setValue("firstName", firstName)
          setValue("lastName", lastName)
          setValue("email", result.data.email)
          setValue("image", result.data.image || "")
          setValue("phone", result.data.phone || "")
          setValue("address", result.data.address || "")
          setValue("city", result.data.city || "")
          setValue("state", result.data.state || "")
          setValue("zipCode", result.data.zipCode || "")
          setValue("country", result.data.country || "")
        }
      } else {
        toast.error(result.error || t.messages.pictureError)
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : t.messages.uploadError.generic)
    } finally {
      setImageLoading(false)
    }
  }

  if (!user) {
    return <div>{authT.pleaseLogin}</div>
  }

  return (
    <Suspense>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-neutral-500">{t.subtitle}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.profileInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 mb-4">
              <Label>{t.profilePicture}</Label>
              <div className="relative w-fit">
                <Avatar 
                  className={cn(
                    "h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity",
                    imageLoading && "opacity-50"
                  )}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <AvatarImage 
                    src={watch("image") || ""} 
                    alt="Profile picture"
                    onError={(e) => {
                      console.error("Image load error:", e)
                      e.currentTarget.src = "" // Clear source on error
                    }}
                  />
                  <AvatarFallback>
                    {watch("firstName")?.[0]}{watch("lastName")?.[0]}
                  </AvatarFallback>
                </Avatar>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imageLoading}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t.firstName}</Label>
                <Input 
                  id="firstName"
                  {...register("firstName")}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t.lastName}</Label>
                <Input 
                  id="lastName"
                  {...register("lastName")}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input 
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                disabled
                className="bg-neutral-50"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phone}</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.addressInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">{t.streetAddress}</Label>
              <Input id="address" {...register("address")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">{t.city}</Label>
                <Input id="city" {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{t.state}</Label>
                <Input id="state" {...register("state")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zipCode">{t.zipCode}</Label>
                <Input id="zipCode" {...register("zipCode")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t.country}</Label>
                <Input id="country" {...register("country")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.notifications.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.notifications.email.title}</p>
                  <p className="text-sm text-neutral-500">
                    {t.notifications.email.description}
                  </p>
                </div>
                <Button variant="outline">{t.notifications.configure}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.notifications.sms.title}</p>
                  <p className="text-sm text-neutral-500">
                    {t.notifications.sms.description}
                  </p>
                </div>
                <Button variant="outline">{t.notifications.configure}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mb-10">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {commonT.loading}
              </>
            ) : (
              commonT.save
            )}
          </Button>
        </div>
      </div>
    </form>
    </Suspense>
  )
}
