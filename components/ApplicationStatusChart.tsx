
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Application } from '../types';
import { ApplicationStatus } from '../types';

interface ApplicationStatusChartProps {
  applications: Application[];
}

const COLORS = {
  [ApplicationStatus.Applied]: '#3b82f6', // blue-500
  [ApplicationStatus.UnderReview]: '#f97316', // orange-500
  [ApplicationStatus.Interviewing]: '#eab308', // yellow-500
  [ApplicationStatus.Offered]: '#22c55e', // green-500
  [ApplicationStatus.Rejected]: '#ef4444', // red-500
  [ApplicationStatus.Withdrawn]: '#6b7280', // gray-500
};

const ApplicationStatusChart: React.FC<ApplicationStatusChartProps> = ({ applications }) => {
  const data = Object.values(ApplicationStatus).map(status => ({
    name: status,
    value: applications.filter(app => app.status === status).length,
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No application data available.</div>;
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
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as ApplicationStatus]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ApplicationStatusChart;
