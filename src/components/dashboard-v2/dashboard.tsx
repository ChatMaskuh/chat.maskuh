"use client";

import React from 'react';
import { useDashboardState } from '@/hooks/use-dashboard-state';
import { DashboardHeader } from './header';
import { SummaryMetrics } from './summary-metrics';
import { ManpowerPerformance } from './manpower-performance';
import { Backlog } from './backlog';
import { WorkflowSection } from './workflow-section';

export function Dashboard() {
  const state = useDashboardState();

  return (
    <>
      <DashboardHeader />
      <div className="px-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          From payment to progress — only cleared orders move forward to pick, pack, and ship.
        </p>
      </div>
      <SummaryMetrics summary={state.summary} />
      <ManpowerPerformance
        summary={state.summary}
        onManpowerChange={state.handleManpowerChange}
      />
      <Backlog
        backlogData={state.backlogData}
        setBacklogData={state.setBacklogData}
      />
      <WorkflowSection
        type="pick"
        title="Summary Pick"
        data={state.pickData}
        setData={state.setPickData}
        chartInstance={state.pickChartInstance}
        color="#8884d8"
      />
      <WorkflowSection
        type="pack"
        title="Summary Pack"
        data={state.packData}
        setData={state.setPackData}
        chartInstance={state.packChartInstance}
        color="#3b82f6"
      />
      <WorkflowSection
        type="shipped"
        title="Summary Ship"
        data={state.shippedData}
        setData={state.setShippedData}
        chartInstance={state.shippedChartInstance}
        color="#10b981"
      />
    </>
  );
}
