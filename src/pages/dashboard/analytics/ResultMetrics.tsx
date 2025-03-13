"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ISuccessRate } from "@/lib/types"


const chartConfig = {
  no: {
    label: "numbers",
  },
  pass: {
    label: "Pass",
    color: "hsl(var(--chart-2))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-1))",
  },
  fail: {
    label: "Fail",
    color: "hsl(var(--chart-3))",
  },
  // edge: {
  //   label: "Edge",
  //   color: "hsl(var(--chart-4))",
  // },
  // other: {
  //   label: "Other",
  //   color: "hsl(var(--chart-5))",
  // },
} satisfies ChartConfig

export default function Component({ data }: { data: ISuccessRate }) {
  const chartData = [
    { grade: "pass", no: data.pass, fill: "#22c55e" },
    { grade: "average", no: data.average, fill: "hsl(var(--chart-5))" },
    { grade: "fail", no: data.fail, fill: "#ef4444" },
  ]

  const totalAttempts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.no, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Grade Chart</CardTitle>
        <CardDescription>March 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="no"
              nameKey="grade"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAttempts.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Attempts
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing success rate for the current month - March 2025
        </div>
      </CardFooter>
    </Card>
  )
}
