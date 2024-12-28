"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewData {
  name: string
  total: number
}

export function Overview({ data }: { data: OverviewData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
          className="fill-violet-500 hover:fill-violet-600 transition-colors"
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 