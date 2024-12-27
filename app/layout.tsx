import "./globals.css"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/contexts/auth-context"
import { RootLayoutContent } from "@/components/root-layout-content"

export const metadata = {
  title: "7-Eleven",
  description: "Your one-stop online shopping destination",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <RootLayoutContent>
            {children}
          </RootLayoutContent>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
