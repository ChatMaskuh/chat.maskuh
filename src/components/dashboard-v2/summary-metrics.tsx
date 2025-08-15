import React from 'react';
import { Boxes, Coins, Hourglass, PackageCheck, SendHorizonal } from 'lucide-react';
import type { DashboardSummary } from '@/hooks/use-dashboard-state';

interface SummaryMetricsProps {
  summary: DashboardSummary;
}

export function SummaryMetrics({ summary }: SummaryMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4" id="summary-metrics">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">Total Pick Order</p>
          <p className="text-3xl font-semibold mt-1" id="total-pick-order">
            {summary.totalPickOrder}
          </p>
        </div>
        <Boxes size={48} className="opacity-30" />
      </div>
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">Total Packed Order</p>
          <p className="text-3xl font-semibold mt-1" id="total-packed-orders">
            {summary.totalPacked}
          </p>
        </div>
        <PackageCheck size={48} className="opacity-30" />
      </div>
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">Total Shipped Order</p>
          <p className="text-3xl font-semibold mt-1" id="total-shipped-orders">
            {summary.totalShipped}
          </p>
        </div>
        <SendHorizonal size={48} className="opacity-30" />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Payment Accepted</p>
          <p className="text-3xl font-semibold mt-1 text-gray-800 dark:text-gray-100" id="payment-accepted-count">
            {summary.payment}
          </p>
        </div>
        <Coins size={48} className="text-amber-500 opacity-60" />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">In Progress</p>
          <p className="text-3xl font-semibold mt-1 dark:text-gray-100" id="in-progress-orders">
            {summary.inProgress}
          </p>
        </div>
        <Hourglass size={48} className="text-blue-500 opacity-60" />
      </div>
    </div>
  );
}
