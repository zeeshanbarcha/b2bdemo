"use client"

import { Suspense } from "react"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 rounded bg-gray-200 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

