export interface Metric {
  label: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease";
  icon: React.ElementType;
}

export interface StaffMember {
  role: string;
  count: number;
  performance: number;
  icon: React.ElementType;
}

export interface BacklogItem {
  storeName: string;
  paymentOrder: number;
  marketplace: string;
}

export type ChartDataPoint = {
  date: string;
  [key: string]: number | string;
};
