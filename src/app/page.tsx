import {
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  Activity,
  Package2,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { ManpowerPerformance } from "@/components/dashboard/manpower-performance";
import { BacklogChart } from "@/components/dashboard/backlog-chart";
import { BacklogTable } from "@/components/dashboard/backlog-table";
import { StaffingSuggestions } from "@/components/dashboard/staffing-suggestions";
import { Header } from "@/components/dashboard/header";
import type { Metric } from "@/lib/types";

const metrics: Metric[] = [
  { label: "Total Pick Orders", value: "5,423", change: "+20.1%", changeType: "increase", icon: ShoppingCart },
  { label: "Packed Orders", value: "3,423", change: "+18.2%", changeType: "increase", icon: Package },
  { label: "Shipped Orders", value: "3,100", change: "-2.5%", changeType: "decrease", icon: Truck },
  { label: "Payment Accepted", value: "$5,600.89", change: "+12.0%", changeType: "increase", icon: CreditCard },
  { label: "In-Progress Orders", value: "2,000", icon: Activity },
];


export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <a
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">OrderFlow</span>
          </a>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-5">
            <Header />
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-5 lg:grid-cols-5">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
          <BacklogChart />
          <ManpowerPerformance />
          <BacklogTable />
          <StaffingSuggestions />
        </main>
      </div>
    </div>
  );
}
