import KPICard from "@/components/Dashboard/KPICard"
import { RailwayNetwork, Train } from "@/lib/types"
import { Network, Timer, Gauge, Zap } from "lucide-react"

interface MetricsPanelProps {
  network: RailwayNetwork
  trains: Train[]
}

export default function MetricsPanel({ network, trains }: MetricsPanelProps) {
  // --- Metric Calculations ---
  // A mix of real-time derived data and placeholder data for simulation-dependent metrics.

  // Calculate Network Utilization based on the number of trains vs. the number of nodes.
  const networkUtilization = Math.min(
    Math.round((trains.length / network.nodes.length) * 100),
    100
  )

  // Placeholder for a metric that would come from a simulation result.
  const onTimePerformance = 94.7

  // Calculate throughput based on the number of trains (e.g., per 30-min window).
  const throughput = trains.length * 2

  // Placeholder for a metric that would come from a simulation result.
  const totalDelay = 13.4

  const metrics = [
    { title: 'Network Utilization', value: networkUtilization, unit: '%', trend: 2.5, Icon: Gauge },
    { title: 'On-Time Performance', value: onTimePerformance, unit: '%', trend: -1.2, Icon: Network },
    { title: 'Avg. Delay', value: totalDelay / trains.length, unit: 'min', trend: -0.8, precision: 1, Icon: Timer },
    { title: 'Throughput', value: throughput, unit: 'trains/hr', trend: 3.1, Icon: Zap }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <KPICard
          key={index}
          title={metric.title}
          value={metric.value.toFixed(metric.precision || 0)}
          unit={metric.unit}
          trend={metric.trend}
          Icon={metric.Icon}
        />
      ))}
    </div>
  )
}

