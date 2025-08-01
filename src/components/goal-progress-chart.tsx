"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { habit: "Workout", progress: 75, goal: 100 },
    { habit: "Read", progress: 80, goal: 100 },
    { habit: "Code", progress: 60, goal: 100 },
    { habit: "Meditate", progress: 100, goal: 100 },
    { habit: "Journal", progress: 50, goal: 100 },
];

const chartConfig = {
  progress: {
    label: "Progress",
    color: "hsl(var(--primary))",
  },
}

export function GoalProgressChart() {
  return (
    <ChartContainer config={chartConfig} className="w-full" >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 20, bottom: 20, left: -10 }}
          accessibilityLayer
        >
          <XAxis dataKey="habit" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="progress" fill="var(--color-progress)" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
