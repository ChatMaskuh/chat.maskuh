"use client";

import React, { useState } from 'react';
import { ChevronDown, UserCheck, PackagePlus, BarChart3, Clock, Truck as TruckIcon } from 'lucide-react';
import type { DashboardSummary } from '@/hooks/use-dashboard-state';

interface ManpowerPerformanceProps {
  summary: DashboardSummary;
  onManpowerChange: (type: 'picker' | 'packer' | 'dispatcher', value: number) => void;
}

const PerformanceCard = ({ title, value, icon, id }: { title: string, value: string, icon: React.ReactNode, id?: string }) => {
    let bgColor = 'bg-gray-400';
    if (id) {
        const percentage = parseFloat(value);
        if (percentage >= 100) {
            bgColor = 'bg-green-500';
        } else if (percentage >= 90) {
            bgColor = 'bg-yellow-500';
        } else if (percentage > 0) {
            bgColor = 'bg-red-500';
        }
    }

    return (
        <div id={id} className={`bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg flex items-center justify-between col-span-1 ${id ? bgColor : ''}`}>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">{title}</p>
                <p className={`text-2xl font-semibold mt-1 text-gray-800 dark:text-gray-100`}>{value}</p>
            </div>
            {icon}
        </div>
    );
}

export function ManpowerPerformance({ summary, onManpowerChange }: ManpowerPerformanceProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors duration-300 mb-4">
      <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Performance Manpower</h2>
        <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div id="performance-content" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Manpower Inputs */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg flex items-center justify-between col-span-1">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Jumlah Picker</p>
              <input type="number" defaultValue={summary.pickerCount} onChange={(e) => onManpowerChange('picker', parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-center text-2xl font-semibold" min="0" />
            </div>
            <UserCheck className="text-blue-500 opacity-60" size={48} />
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg flex items-center justify-between col-span-1">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Jumlah Packer</p>
              <input type="number" defaultValue={summary.packerCount} onChange={(e) => onManpowerChange('packer', parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-center text-2xl font-semibold" min="0" />
            </div>
            <PackagePlus className="text-emerald-500 opacity-60" size={48} />
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg flex items-center justify-between col-span-1">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Jumlah Dispatcher</p>
              <input type="number" defaultValue={summary.dispatcherCount} onChange={(e) => onManpowerChange('dispatcher', parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-center text-2xl font-semibold" min="0" />
            </div>
            <TruckIcon className="text-blue-500 opacity-60" size={48} />
          </div>

          {/* Performance Metrics */}
          <PerformanceCard title="Performance Picker" value={`${summary.performancePicker}%`} icon={<BarChart3 size={48} className="text-sky-500 opacity-60" />} id="card-performance-picker" />
          <PerformanceCard title="Performance Packer" value={`${summary.performancePacker}%`} icon={<BarChart3 size={48} className="text-sky-500 opacity-60" />} id="card-performance-packer" />
          <PerformanceCard title="Performance Dispatcher" value={`${summary.performanceShipped}%`} icon={<BarChart3 size={48} className="text-sky-500 opacity-60" />} id="card-performance-shipped" />
          
          {/* Average Metrics */}
          <PerformanceCard title="Average Pick / Hours" value={summary.averagePickPerHour} icon={<BarChart3 size={48} className="text-fuchsia-500 opacity-60" />} />
          <PerformanceCard title="Average Pack / Hours" value={summary.averagePackPerHour} icon={<Clock size={48} className="text-red-500 opacity-60" />} />
          <PerformanceCard title="Average Shipped / Hours" value={summary.averageShippedPerHour} icon={<TruckIcon size={48} className="text-orange-500 opacity-60" />} />
        </div>
      )}
    </div>
  );
}
