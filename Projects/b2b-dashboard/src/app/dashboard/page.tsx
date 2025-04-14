import type { Metadata } from "next"
import { ArrowDownToLine, ArrowUpFromLine, Bell, Globe, Plus, RefreshCw, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Dashboard | B2BDemo",
  description: "Example crypto trading dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-lg font-semibold">Welcome, Alex</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button size="icon" variant="ghost">
            <Globe className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Widget
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  <Progress className="mt-3" value={45} />
                </CardContent>
              </Card>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12</div>
                  <p className="text-xs text-muted-foreground">+4 since last hour</p>
                  <Progress className="mt-3" value={12} />
                </CardContent>
              </Card>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+$1,234.32</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                  <Progress className="mt-3" value={19} />
                </CardContent>
              </Card>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2 devices</div>
                  <p className="text-xs text-muted-foreground">+2 since last hour</p>
                  <Progress className="mt-3" value={20} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle>Portfolio Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* Chart Component */}
                  <div className="h-[200px] bg-muted/50 rounded-md flex items-center justify-center">
                    Chart Placeholder
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3 hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequently used trading actions</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button className="w-full justify-start" variant="outline">
                    <ArrowUpFromLine className="mr-2 h-4 w-4" />
                    Deposit Funds
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Withdraw Funds
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Exchange Crypto
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

