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

const iconMap: Record<string, LucideIcon> = {
  electronics: Laptop,
  home: Home,
  fashion: Shirt,
  computers: Monitor,
  automotive: Car,
  beauty: Sparkles,
  sports: Dumbbell,
}

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "home", name: "Home & Kitchen" },
  { id: "fashion", name: "Fashion" },
  { id: "computers", name: "Computers" },
  { id: "automotive", name: "Car & Motorbike" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "sports", name: "Sports, Fitness & Outdoors" },
]

export function CategoriesSection() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {categories.map((category) => {
        const Icon = iconMap[category.id] || Laptop

        return (
          <Link key={category.id} href={`/products?category=${category.id}`}>
            <Card className="h-full hover:border-foreground transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="mb-3 rounded-full bg-muted p-2">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-sm font-medium text-card-foreground">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
