import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"

const categories = [
  { id: "electronics", name: "Electronics", icon: "Laptop" },
  { id: "home-kitchen", name: "Home & Kitchen", icon: "Utensils" },
  { id: "fashion", name: "7-Eleven Fashion", icon: "Shirt" },
  { id: "computers", name: "Computers", icon: "Monitor" },
  { id: "automotive", name: "Car & Motorbike", icon: "Car" },
  { id: "beauty", name: "Beauty & Personal Care", icon: "Sparkles" },
  { id: "sports", name: "Sports & Outdoors", icon: "Dumbbell" },
]

export function CategoriesSection() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {categories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons]
        return (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="h-full hover:border-neutral-900 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="mb-3 rounded-full bg-neutral-100 p-2">
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
