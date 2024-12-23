import { ResizeObserverHandler } from "@/components/resize-observer-handler"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ResizeObserverHandler>
          {children}
        </ResizeObserverHandler>
      </body>
    </html>
  )
}

