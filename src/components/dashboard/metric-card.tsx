import type { Metric } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        {metric.change && (
          <p className="text-xs text-muted-foreground flex items-center">
            {metric.changeType === 'increase' ? (
              <ArrowUp className="h-4 w-4 text-accent mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-destructive mr-1" />
            )}
            <span
              className={cn(
                "mr-1",
                metric.changeType === 'increase' ? "text-accent" : "text-destructive"
              )}
            >
              {metric.change}
            </span>
            vs last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
