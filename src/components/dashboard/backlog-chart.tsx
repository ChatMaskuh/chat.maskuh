"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "January", shopify: 186, amazon: 80, etsy: 120 },
  { month: "February", shopify: 305, amazon: 200, etsy: 150 },
  { month: "March", shopify: 237, amazon: 120, etsy: 180 },
  { month: "April", shopify: 73, amazon: 190, etsy: 90 },
  { month: "May", shopify: 209, amazon: 130, etsy: 160 },
  { month: "June", shopify: 214, amazon: 140, etsy: 110 },
];

const chartConfig = {
  orders: {
    label: "Orders",
  },
  shopify: {
    label: "Shopify",
    color: "hsl(var(--chart-1))",
  },
  amazon: {
    label: "Amazon",
    color: "hsl(var(--chart-2))",
  },
  etsy: {
    label: "Etsy",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function BacklogChart() {
  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Backlog Visualization</CardTitle>
        <CardDescription>Monthly order counts by platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="shopify" fill="var(--color-shopify)" radius={4} />
            <Bar dataKey="amazon" fill="var(--color-amazon)" radius={4} />
            <Bar dataKey="etsy" fill="var(--color-etsy)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
