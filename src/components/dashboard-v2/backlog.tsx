"use client";

import React, { useState, useRef } from 'react';
import { ChevronDown, Upload, Download, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface BacklogProps {
  backlogData: any[];
  setBacklogData: React.Dispatch<React.SetStateAction<any[]>>;
}

export function Backlog({
  backlogData,
  setBacklogData,
}: BacklogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'detail'>('all');

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
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        const newBacklogData: any[] = [];
        
        // Check header, assume first line is header
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        const expectedHeaders = ['store name', 'payment accepted', 'marketplace', 'platform'];
        
        // Basic header validation
        if (header.length < expectedHeaders.length) {
            toast({ title: 'Invalid CSV format', description: 'Missing required columns.', variant: 'destructive'});
            return;
        }

        lines.slice(1).forEach(line => {
            const parts = line.split(',');
            if (parts.length >= 4) {
                newBacklogData.push({
                    storeName: parts[0].trim(),
                    paymentAccepted: (parts[1].trim() && !isNaN(parseInt(parts[1].trim(), 10))) ? parts[1].trim() : "0", 
                    marketplace: parts[2].trim(),
                    platform: parts[3].trim()
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
    if (backlogData.length === 0) {
      toast({ title: 'Tidak ada data untuk diekspor', variant: 'destructive' });
      return;
    }
    const filename = 'backlog_data.csv';
    const headers = ['STORE NAME', 'PAYMENT ACCEPTED', 'MARKETPLACE', 'PLATFORM'];
    let csvContent = headers.join(',') + '\n';
    backlogData.forEach(item => {
        csvContent += `${item.storeName},${item.paymentAccepted},${item.marketplace},${item.platform}\n`;
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Marketplace Backlog</h2>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <Button 
                    onClick={() => setActiveTab('all')} 
                    variant={activeTab === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className={activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'text-gray-600 dark:text-gray-300'}
                >
                    All MP Store
                </Button>
                <Button 
                    onClick={() => setActiveTab('detail')} 
                    variant={activeTab === 'detail' ? 'default' : 'ghost'}
                    size="sm"
                    className={activeTab === 'detail' ? 'bg-primary text-primary-foreground' : 'text-gray-600 dark:text-gray-300'}
                >
                    Detail MP Store
                </Button>
            </div>
            <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="bg-yellow-400 text-black hover:bg-yellow-500">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button onClick={handleUploadClick} size="sm" variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                    <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <Button onClick={exportBacklogCSV} size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                    <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            </div>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-400 uppercase tracking-wider">Store Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-400 uppercase tracking-wider">Payment Accepted</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-400 uppercase tracking-wider">Marketplace</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-400 uppercase tracking-wider">Platform</th>
                  </tr>
                </thead>
                <tbody id="backlog-table-body" className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {backlogData.length > 0 ? (
                    backlogData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.storeName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.paymentAccepted}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.marketplace}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.platform}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                        No backlog data. Please upload a CSV.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
