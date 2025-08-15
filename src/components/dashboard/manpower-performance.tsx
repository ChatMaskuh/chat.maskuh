"use client";

import type { StaffMember } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Package, Ship } from "lucide-react";

const staffData: StaffMember[] = [
  { role: "Pickers", count: 12, performance: 85, icon: Users },
  { role: "Packers", count: 8, performance: 92, icon: Package },
  { role: "Dispatchers", count: 5, performance: 78, icon: Ship },
];

export function ManpowerPerformance() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Manpower Performance</CardTitle>
        <CardDescription>Daily performance of warehouse staff.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {staffData.map((staff) => (
          <div key={staff.role} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <staff.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{staff.role} ({staff.count})</span>
              </div>
              <span className="text-sm font-semibold text-muted-foreground">{staff.performance}%</span>
            </div>
            <Progress value={staff.performance} aria-label={`${staff.role} performance`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
