import "./globals.css"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/contexts/auth-context"
import { RootLayoutContent } from "@/components/root-layout-content"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/contexts/currency-context"

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storageKey = 'ui-theme'
                  const theme = localStorage.getItem(storageKey)
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                  
                  document.documentElement.classList.add(theme === 'system' ? systemTheme : theme || systemTheme)
                  
                  // Add this to prevent flash
                  document.documentElement.style.colorScheme = theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? 'dark' : 'light'
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <AuthProvider>
              <RootLayoutContent>
                {children}
              </RootLayoutContent>
              <Toaster position="top-center" />
            </AuthProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
