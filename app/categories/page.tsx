"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { 
  Laptop, 
  Home, 
  Shirt, 
  Monitor, 
  Car, 
  Sparkles, 
  Dumbbell,
  LucideIcon 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

interface Category {
  id: string
  name: string
}

const iconMap: Record<string, LucideIcon> = {
  electronics: Laptop,
  home: Home,
  fashion: Shirt,
  computers: Monitor,
  automotive: Car,
  beauty: Sparkles,
  sports: Dumbbell,
}

export default function CategoriesPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t.nav.categories}</h1>
        <p className="mt-2 text-muted-foreground">{t.home.sections.categories}</p>
      </div>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="flex flex-col items-center p-6">
            <div className="h-12 w-12 rounded-full bg-neutral-200" />
            <div className="mt-4 h-4 w-24 rounded bg-neutral-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CategoriesContent() {
  const { language } = useLanguage()
  const t = translations[language]
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = iconMap[category.id] || Laptop
        const translatedName = t.categories[category.id as keyof typeof t.categories] || category.name

        return (
          <Link key={category.id} href={`/products?category=${category.id}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex flex-col items-center p-6">
                <Icon className="h-12 w-12" />
                <h3 className="mt-4 font-medium">{translatedName}</h3>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
} 