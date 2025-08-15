"use client";

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Chart } from 'chart.js';
import { generateHours } from '@/lib/utils-v2';

interface WorkflowSectionProps {
  type: 'pick' | 'pack' | 'shipped';
  title: string;
  data: number[];
  setData: (data: number[]) => void;
  chartInstance: React.MutableRefObject<Chart | undefined>;
  color: string;
}

const hours = generateHours();

export function WorkflowSection({ type, title, data, setData, chartInstance, color }: WorkflowSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(24);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDataChange = (index: number, value: number) => {
    const newData = [...data];
    newData[index] = value;
    setData(newData);
  };
  
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
            const newData = Array(hours.length).fill(0);
            
            lines.slice(1).forEach(line => {
                const parts = line.split(',');
                if (parts.length === 2) {
                    const hour = parts[0].trim();
                    const value = parseInt(parts[1].trim(), 10);
                    const index = hours.indexOf(hour);
                    if (index !== -1 && !isNaN(value)) {
                        newData[index] = value;
                    }
                }
            });
            setData(newData);
            toast({ title: `Upload CSV ${type} berhasil!`, variant: 'default' });
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

  const exportCSV = () => {
    const filename = `${type}_data.csv`;
    const headers = ['Jam', `Jumlah Order ${type === 'shipped' ? 'Shipped' : type.charAt(0).toUpperCase() + type.slice(1)}`];
    let csvContent = headers.join(',') + '\n';
    hours.forEach((hour, index) => {
        csvContent += `${hour},${data[index]}\n`;
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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="flex items-center space-x-2">
            <label htmlFor={`${type}-start-hour`} className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</label>
            <Input type="number" id={`${type}-start-hour`} value={startHour} onChange={(e) => setStartHour(parseInt(e.target.value))} min="0" max="24" className="w-16 p-1 border rounded-md text-center" onClick={(e) => e.stopPropagation()} />
            <label htmlFor={`${type}-end-hour`} className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
            <Input type="number" id={`${type}-end-hour`} value={endHour} onChange={(e) => setEndHour(parseInt(e.target.value))} min="0" max="24" className="w-16 p-1 border rounded-md text-center" onClick={(e) => e.stopPropagation()} />
            <div className="hidden sm:flex items-center space-x-2 ml-4">
              <Button onClick={(e) => { e.stopPropagation(); handleUploadClick(); }} size="sm" variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">Upload CSV</Button>
              <Button onClick={(e) => { e.stopPropagation(); exportCSV(); }} size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600">Export CSV</Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            </div>
            <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && (
        <div id={`${type}-content`}>
          <div className="overflow-x-auto pb-4">
            <div id={`${type}-input-container`} className="flex space-x-2 min-w-[1200px]">
              {hours.map((hour, index) => (
                <div key={hour} className="flex-none w-24 text-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">{hour}</label>
                  <Input
                    type="number"
                    value={data[index] || 0}
                    onChange={(e) => handleDataChange(index, parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 h-80">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Grafik Total {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <canvas id={`${type}-chart`}></canvas>
          </div>
        </div>
      )}
    </div>
  );
}
