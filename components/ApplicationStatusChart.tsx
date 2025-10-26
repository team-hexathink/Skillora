import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Application } from '../types';
import { ApplicationStatus } from '../types';

interface ApplicationStatusChartProps {
  applications: Application[];
}

/**
 * Read a CSS custom property with an SSR-safe guard. Returns the fallback when running on the server.
 */
const getCssVar = (name: string, fallback: string) => {
  if (typeof window !== 'undefined' && typeof getComputedStyle === 'function') {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name);
    return val ? val.trim() : fallback;
  }
  return fallback;
};

const ApplicationStatusChart: React.FC<ApplicationStatusChartProps> = ({ applications }) => {
  // Build the color map on the client (falls back to the hex values during SSR)
  const COLORS = useMemo(() => ({
    [ApplicationStatus.Applied]: getCssVar('--status-applied', '#3b82f6'), // blue-500
    [ApplicationStatus.UnderReview]: getCssVar('--status-under-review', '#f97316'), // orange-500
    [ApplicationStatus.Interviewing]: getCssVar('--status-interviewing', '#eab308'), // yellow-500
    [ApplicationStatus.Offered]: getCssVar('--status-offered', '#22c55e'), // green-500
    [ApplicationStatus.Rejected]: getCssVar('--status-rejected', '#ef4444'), // red-500
    [ApplicationStatus.Withdrawn]: getCssVar('--status-withdrawn', '#6b7280'), // gray-500
  }), []);

  const data = Object.values(ApplicationStatus)
    .map(status => ({
      name: status,
      value: applications.filter(app => app.status === status).length,
    }))
    .filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No application data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name as ApplicationStatus] ?? '#cccccc'}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ApplicationStatusChart;
