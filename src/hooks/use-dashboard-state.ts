"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { generateHours } from '@/lib/utils-v2';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const hours = generateHours();

const initialBacklogData: any[] = [];

export interface DashboardSummary {
    totalPickOrder: number;
    totalPacked: number;
    totalShipped: number;
    payment: number;
    inProgress: number;
    averagePickPerHour: string;
    averagePackPerHour: string;
    averageShippedPerHour: string;
    pickerCount: number;
    packerCount: number;
    dispatcherCount: number;
    performancePicker: string;
    performancePacker: string;
    performanceShipped: string;
}

export function useDashboardState() {
  const [pickData, setPickData] = useState<number[]>(() => Array(hours.length).fill(0));
  const [packData, setPackData] = useState<number[]>(() => Array(hours.length).fill(0));
  const [shippedData, setShippedData] = useState<number[]>(() => Array(hours.length).fill(0));
  const [backlogData, setBacklogData] = useState<any[]>(initialBacklogData);

  const [pickerCount, setPickerCount] = useState(0);
  const [packerCount, setPackerCount] = useState(0);
  const [dispatcherCount, setDispatcherCount] = useState(0);

  const [currentBacklogFilter, setCurrentBacklogFilter] = useState<'platform' | 'source'>('platform');
  const [currentBacklogDataMode, setCurrentBacklogDataMode] = useState<'count' | 'payment'>('count');

  const [summary, setSummary] = useState<DashboardSummary>({
    totalPickOrder: 0, totalPacked: 0, totalShipped: 0, payment: 0, inProgress: 0,
    averagePickPerHour: '0', averagePackPerHour: '0', averageShippedPerHour: '0',
    pickerCount: 0, packerCount: 0, dispatcherCount: 0,
    performancePicker: '0.00', performancePacker: '0.00', performanceShipped: '0.00',
  });

  const pickChartInstance = useRef<Chart>();
  const packChartInstance = useRef<Chart>();
  const shippedChartInstance = useRef<Chart>();
  const backlogChartInstance = useRef<Chart>();

  const handleManpowerChange = (type: 'picker' | 'packer' | 'dispatcher', value: number) => {
    if (isNaN(value) || value < 0) value = 0;
    if (type === 'picker') setPickerCount(value);
    if (type === 'packer') setPackerCount(value);
    if (type === 'dispatcher') setDispatcherCount(value);
  };
  
  const updateSummary = useCallback(() => {
    const totalPickOrder = pickData.reduce((sum, value) => sum + (value || 0), 0);
    const totalPackOrder = packData.reduce((sum, value) => sum + (value || 0), 0);
    const totalShippedOrder = shippedData.reduce((sum, value) => sum + (value || 0), 0);
    const paymentOrders = backlogData.reduce((sum, item) => sum + (parseInt(item.payment_order, 10) || 0), 0);

    const nonZeroPickValues = pickData.filter(v => v > 0);
    const nonZeroPackValues = packData.filter(v => v > 0);
    const nonZeroShippedValues = shippedData.filter(v => v > 0);

    const averagePickPerHour = nonZeroPickValues.length > 0 ? Math.round(totalPickOrder / nonZeroPickValues.length).toString() : '0';
    const averagePackPerHour = nonZeroPackValues.length > 0 ? Math.round(totalPackOrder / nonZeroPackValues.length).toString() : '0';
    const averageShippedPerHour = nonZeroShippedValues.length > 0 ? Math.round(totalShippedOrder / nonZeroShippedValues.length).toString() : '0';

    const inProgressOrders = totalPickOrder - totalPackOrder;

    const targetPick = 650;
    const targetPack = 525;
    const targetShipped = 515;

    const performancePicker = (pickerCount > 0) ? Math.min(((totalPickOrder / pickerCount) / targetPick) * 100, 100) : 0;
    const performancePacker = (packerCount > 0) ? Math.min(((totalPackOrder / packerCount) / targetPack) * 100, 100) : 0;
    const performanceShipped = (dispatcherCount > 0) ? Math.min(((totalShippedOrder / dispatcherCount) / targetShipped) * 100, 100) : 0;

    setSummary({
        totalPickOrder,
        totalPacked: totalPackOrder,
        totalShipped: totalShippedOrder,
        payment: paymentOrders,
        inProgress: inProgressOrders,
        averagePickPerHour,
        averagePackPerHour,
        averageShippedPerHour,
        pickerCount,
        packerCount,
        dispatcherCount,
        performancePicker: performancePicker.toFixed(2),
        performancePacker: performancePacker.toFixed(2),
        performanceShipped: performanceShipped.toFixed(2),
    });
  }, [pickData, packData, shippedData, backlogData, pickerCount, packerCount, dispatcherCount]);


  const renderChart = useCallback((
    canvasId: string, 
    chartInstanceRef: React.MutableRefObject<Chart | undefined>,
    labels: string[],
    data: number[],
    chartLabel: string,
    backgroundColor: string | string[]
  ) => {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
    }
    
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: chartLabel,
              data: data,
              backgroundColor,
              borderRadius: 10,
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true }
          },
          plugins: {
              legend: {
                display: true,
              },
              datalabels: {
                  anchor: 'end',
                  align: 'top',
                  formatter: (value) => value > 0 ? value : '',
                  color: '#4A5568',
                  font: {
                      weight: 'bold'
                  }
              }
          }
      }
    });
  }, []);

  const renderWorkflowCharts = useCallback(() => {
    renderChart('pick-chart', pickChartInstance, hours, pickData, 'Jumlah Order Picked', '#8884d8');
    renderChart('pack-chart', packChartInstance, hours, packData, 'Jumlah Order Packed', '#3b82f6');
    renderChart('shipped-chart', shippedChartInstance, hours, shippedData, 'Jumlah Order Shipped', '#10b981');
  }, [pickData, packData, shippedData, renderChart]);
  
  const renderBacklogChart = useCallback(() => {
    let backlogLabels: string[] = [];
    let backlogValues: number[] = [];
    let chartLabel = '';
    
    const dataToFilter = currentBacklogFilter;
    const groupedData: { [key: string]: number } = {};

    if (currentBacklogDataMode === 'count') {
        backlogData.forEach(item => {
            const key = item[dataToFilter];
            const normalizedKey = key.toLowerCase().startsWith('shopee') || key.toLowerCase().startsWith('shoope') ? 'Shopee' : key.split(' ')[0];
            groupedData[normalizedKey] = (groupedData[normalizedKey] || 0) + 1;
        });
        backlogLabels = Object.keys(groupedData);
        backlogValues = Object.values(groupedData);
        chartLabel = 'Count of Store';
    } else if (currentBacklogDataMode === 'payment') {
        backlogData.forEach(item => {
            const key = item[dataToFilter];
            const normalizedKey = key.toLowerCase().startsWith('shopee') || key.toLowerCase().startsWith('shoope') ? 'Shopee' : key.split(' ')[0];
            groupedData[normalizedKey] = (groupedData[normalizedKey] || 0) + (parseInt(item.payment_order, 10) || 0);
        });
        backlogLabels = Object.keys(groupedData);
        backlogValues = Object.values(groupedData);
        chartLabel = 'Total Payment Orders';
    }
    
    renderChart(
      'backlog-chart', 
      backlogChartInstance, 
      backlogLabels, 
      backlogValues, 
      chartLabel,
      ['#8884d8', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#60a5fa', '#34d399', '#7f1d1d', '#5b21b6', '#065f46', '#e11d48']
    );

  }, [backlogData, currentBacklogFilter, currentBacklogDataMode, renderChart]);

  useEffect(() => {
    updateSummary();
    renderWorkflowCharts();
    renderBacklogChart();
  }, [updateSummary, renderWorkflowCharts, renderBacklogChart]);

  return {
    pickData, setPickData,
    packData, setPackData,
    shippedData, setShippedData,
    backlogData, setBacklogData,
    summary,
    handleManpowerChange,
    currentBacklogFilter, setCurrentBacklogFilter,
    currentBacklogDataMode, setCurrentBacklogDataMode,
    pickChartInstance,
    packChartInstance,
    shippedChartInstance,
    backlogChartInstance
  };
}
