"use client";

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Chart } from 'chart.js';

interface BacklogProps {
  backlogData: any[];
  setBacklogData: React.Dispatch<React.SetStateAction<any[]>>;
  currentBacklogFilter: string;
  setCurrentBacklogFilter: (filter: 'platform' | 'source') => void;
  currentBacklogDataMode: string;
  setCurrentBacklogDataMode: (mode: 'count' | 'payment') => void;
  backlogChartInstance: React.MutableRefObject<Chart | undefined>;
}

export function Backlog({
  backlogData,
  setBacklogData,
  currentBacklogFilter,
  setCurrentBacklogFilter,
  currentBacklogDataMode,
  setCurrentBacklogDataMode,
  backlogChartInstance,
}: BacklogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({ title: 'Upload dibatalkan', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        const newBacklogData: any[] = [];
        
        lines.slice(1).forEach(line => {
            const parts = line.split(',');
            if (parts.length >= 3) {
                newBacklogData.push({
                    platform: parts[0].trim(),
                    payment_order: (parts[1].trim() && !isNaN(parseInt(parts[1].trim(), 10))) ? parts[1].trim() : "0", 
                    source: parts[2].trim()
                });
            }
        });
        setBacklogData(newBacklogData);
        setIsOpen(true);
        toast({ title: 'Upload CSV Backlog berhasil!', variant: 'default' });
      } catch (error) {
        toast({ title: 'Gagal memproses file CSV.', variant: 'destructive' });
        console.error('Error processing CSV:', error);
      }
    };
    reader.onerror = function() {
      toast({ title: 'Gagal membaca file.', variant: 'destructive' });
    };
    reader.readAsText(file);
  };

  const exportBacklogCSV = () => {
    const filename = 'backlog_data.csv';
    const headers = ['Store Name', 'Payment Order', 'Marketplace Store'];
    let csvContent = headers.join(',') + '\n';
    backlogData.forEach(item => {
        csvContent += `${item.platform},${item.payment_order},${item.source}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors duration-300 mb-4">
      <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Backlog Marketplace</h2>
        <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center space-x-2 ml-4">
                <Button onClick={(e) => { e.stopPropagation(); handleUploadClick(); }} size="sm" variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">Upload CSV</Button>
                <Button onClick={(e) => { e.stopPropagation(); exportBacklogCSV(); }} size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600">Export CSV</Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            </div>
            <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && (
        <div id="backlog-content" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-400 uppercase tracking-wider">Store Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-400 uppercase tracking-wider">Payment Order</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-400 uppercase tracking-wider">Marketplace Store</th>
                </tr>
              </thead>
              <tbody id="backlog-table-body" className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {backlogData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.payment_order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 h-80">
            <div className="flex items-center justify-between mb-4">
              <h3 id="backlog-chart-title" className="text-lg font-medium text-gray-800 dark:text-gray-300">
                {currentBacklogDataMode === 'count' ? 'Grafik Backlog per Store Name' : 'Grafik Payment Order per Store Name'}
              </h3>
              <div className="flex space-x-2">
                <Button size="sm" variant={currentBacklogFilter === 'platform' ? 'default' : 'secondary'} onClick={() => setCurrentBacklogFilter('platform')}>Filter by Store Name</Button>
                <Button size="sm" variant={currentBacklogFilter === 'source' ? 'default' : 'secondary'} onClick={() => setCurrentBacklogFilter('source')}>Filter by Marketplace</Button>
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" variant={currentBacklogDataMode === 'count' ? 'default' : 'secondary'} onClick={() => setCurrentBacklogDataMode('count')}>Count of Store</Button>
              <Button size="sm" variant={currentBacklogDataMode === 'payment' ? 'default' : 'secondary'} onClick={() => setCurrentBacklogDataMode('payment')}>Total Payment</Button>
            </div>
            <canvas id="backlog-chart" className="mt-4"></canvas>
          </div>
        </div>
      )}
    </div>
  );
}
