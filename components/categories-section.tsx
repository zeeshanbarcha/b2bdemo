"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
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
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

const iconMap: Record<string, LucideIcon> = {
  electronics: Laptop,
  home: Home,
  fashion: Shirt,
  computers: Monitor,
  automotive: Car,
  beauty: Sparkles,
  sports: Dumbbell,
}

const categoryIds = [
  "electronics",
  "home",
  "fashion",
  "computers",
  "automotive",
  "beauty",
  "sports",
] as const

export function CategoriesSection() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {categoryIds.map((id) => {
        const Icon = iconMap[id]

        return (
          <Link key={id} href={`/products?category=${id}`}>
            <Card className="h-full hover:border-foreground transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="mb-3 rounded-full bg-muted p-2">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {t.categories[id]}
                </span>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
