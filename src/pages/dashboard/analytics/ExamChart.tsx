
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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


const chartConfig = {
  attempts: {
    label: "Attempts",
    color: "hsl(var(--chart-2))",
  },
  // mobile: {
  //   label: "Mobile",
  //   color: "hsl(var(--chart-2))",
  // },
} satisfies ChartConfig

export default function ExamChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Chart</CardTitle>
        <CardDescription>March 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `week ${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="attempts"
              type="natural"
              stroke="var(--color-attempts)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-attempts)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total exam attempts per week for the current month - March 2025
        </div>
      </CardFooter>
    </Card>
  )
}
