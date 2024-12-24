import "./globals.css"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

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
        <div className="relative flex min-h-screen flex-col">
          <MainNav />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
