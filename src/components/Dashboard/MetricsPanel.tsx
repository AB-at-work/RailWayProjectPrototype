// components/Dashboard/MetricsPanel.tsx
import KPICard from './KPICard';

export default function MetricsPanel() {
  const metrics = [
    { title: 'Network Utilization', value: 87, unit: '%', trend: 2.5 },
    { title: 'On-Time Performance', value: 94, unit: '%', trend: 1.2 },
    { title: 'Avg. Delay', value: 2.3, unit: 'min', trend: -0.8 },
    { title: 'Throughput', value: 42, unit: 'trains/hr', trend: 3.1 }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <KPICard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            trend={metric.trend}
          />
        ))}
      </div>
    </div>
  );
}