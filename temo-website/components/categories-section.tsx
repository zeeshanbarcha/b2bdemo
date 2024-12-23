import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/config/products"
import { Icons } from "@/components/icons"

const CategoriesSection = () => {
  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {categories.map((category) => {
          const IconComponent = Icons[category.icon as keyof typeof Icons];
          return (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="hover:border-neutral-900 transition-colors dark:hover:border-neutral-50">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="mb-4 rounded-full bg-neutral-100 p-2 dark:bg-neutral-800">
                    {IconComponent && <IconComponent className="h-6 w-6" />}
                  </div>
                  <span className="text-center font-medium">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  )
}

export default CategoriesSection

