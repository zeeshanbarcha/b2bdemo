'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundSkeleton />}>
      <NotFoundContent />
    </Suspense>
  )
}

function NotFoundSkeleton() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-12 w-24 bg-gray-200 rounded-lg animate-pulse mx-auto" />
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mx-auto mt-6" />
      </div>
    </div>
  )
}

function NotFoundContent() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-lg text-neutral-600">Page not found</p>
        <p className="mt-1 text-neutral-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
} 