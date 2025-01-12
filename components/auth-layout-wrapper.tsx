"use client"

import { usePathname } from "next/navigation"
import { RootLayoutContent } from "@/components/root-layout-content"

export function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return pathname?.startsWith('/auth') ? (
    children
  ) : (
    <RootLayoutContent>{children}</RootLayoutContent>
  )
} 