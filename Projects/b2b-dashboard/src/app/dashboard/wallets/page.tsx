import type { Metadata } from "next"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CryptoIcon } from "@/components/crypto-icon"

export const metadata: Metadata = {
  title: "Wallets | B2BDemo",
  description: "Manage your crypto wallets",
}

const wallets = [
  { name: "Bitcoin", symbol: "BTC", balance: "0", usdBalance: "0 USD", id: "32378" },
  { name: "Ethereum", symbol: "ETH", balance: "0", usdBalance: "0 USD", id: "32379" },
  { name: "Litecoin", symbol: "LTC", balance: "0", usdBalance: "0 USD", id: "32380" },
  { name: "Bitcoin Cash", symbol: "BCH", balance: "0", usdBalance: "0 USD", id: "32381" },
  { name: "DASH", symbol: "DASH", balance: "0", usdBalance: "0 USD", id: "32382" },
  { name: "Monero", symbol: "XMR", balance: "0", usdBalance: "0 USD", id: "32383" },
  { name: "Tether", symbol: "USDT", balance: "0", usdBalance: "0 USD", id: "32384" },
  { name: "NEO", symbol: "NEO", balance: "0", usdBalance: "0 USD", id: "32385" },
  { name: "XEM", symbol: "XEM", balance: "0", usdBalance: "0 USD", id: "32386" },
  { name: "Cardano", symbol: "ADA", balance: "0", usdBalance: "0 USD", id: "32387" },
  { name: "TrueUSD", symbol: "TUSD", balance: "0", usdBalance: "0 USD", id: "32388" },
  { name: "Gemini Dollar", symbol: "GUSD", balance: "0", usdBalance: "0 USD", id: "32389" },
]

export default function WalletsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-2xl font-semibold">Wallets</h1>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold tracking-tight">Estimated Total</h2>
            <span className="text-3xl font-bold">0 USD</span>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Wallet
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="cryptocurrency">Cryptocurrency</TabsTrigger>
                <TabsTrigger value="fiat">Fiat</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search" className="w-full md:w-[300px]" />
              <Button variant="outline">Default</Button>
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <CryptoIcon symbol={wallet.symbol} className="h-8 w-8" />
                      <div>
                        <h3 className="font-semibold">{wallet.name}</h3>
                        <p className="text-sm text-muted-foreground">ID {wallet.id}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Favorite</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </Button>
                  </div>
                  <div className="border-t bg-muted/50 p-4">
                    <p className="text-2xl font-bold">{wallet.balance}</p>
                    <p className="text-sm text-muted-foreground">{wallet.usdBalance}</p>
                    <p className="mt-2 text-xs text-muted-foreground">On Hold: 0</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

