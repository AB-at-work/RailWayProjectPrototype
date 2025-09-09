"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Badge } from "@/components/UI/badge"
import { Button } from "@/components/UI/button"
import { RailwayNetwork, Train } from "@/lib/types"
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Zap, AlertTriangle } from "lucide-react"

interface AnalyticsClientProps {
  initialNetwork: RailwayNetwork
  initialTrains: Train[]
}

export default function AnalyticsClient({ initialNetwork, initialTrains }: AnalyticsClientProps) {
  const [network] = useState<RailwayNetwork>(initialNetwork)
  const [trains] = useState<Train[]>(initialTrains)
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'utilization' | 'efficiency'>('performance')

  // Generate performance data over time
  const performanceData = useMemo(() => {
    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      onTime: Math.max(75, 95 - Math.random() * 20 - Math.abs(hour - 12) * 2),
      delayed: Math.random() * 15,
      cancelled: Math.random() * 5,
      throughput: Math.floor(Math.random() * 30) + 20 + Math.sin(hour * Math.PI / 12) * 10
    }))
  }, [])

  // Network utilization by node
  const utilizationData = useMemo(() => {
    return network.nodes.map(node => {
      const trainsAtNode = trains.filter(train =>
        train.route.includes(node.id) ||
        train.schedule.some(stop => stop.node === node.id)
      ).length

      return {
        name: node.name,
        utilization: Math.min(100, (trainsAtNode / node.capacity) * 100),
        capacity: node.capacity,
        current: trainsAtNode,
        efficiency: Math.max(60, 95 - Math.random() * 25)
      }
    })
  }, [network.nodes, trains])

  // Train type distribution
  const trainTypeData = useMemo(() => {
    const passenger = trains.filter(t => t.type === 'passenger').length
    const freight = trains.filter(t => t.type === 'freight').length

    return [
      { name: 'Passenger', value: passenger, color: '#3b82f6' },
      { name: 'Freight', value: freight, color: '#ef4444' },
    ]
  }, [trains])

  // Priority distribution
  const priorityData = useMemo(() => {
    const high = trains.filter(t => t.priority === 'high').length
    const medium = trains.filter(t => t.priority === 'medium').length
    const low = trains.filter(t => t.priority === 'low').length

    return [
      { name: 'High Priority', value: high, color: '#dc2626' },
      { name: 'Medium Priority', value: medium, color: '#f59e0b' },
      { name: 'Low Priority', value: low, color: '#10b981' },
    ]
  }, [trains])

  const currentMetrics = {
    avgDelay: 12.3,
    onTimePerformance: 94.7,
    networkEfficiency: 87.2,
    totalThroughput: 156,
    peakUtilization: Math.max(...utilizationData.map(d => d.utilization)),
    criticalNodes: utilizationData.filter(d => d.utilization > 85).length
  }

  return (
    <div className="h-screen overflow-hidden p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Analytics Command</h1>
          <p className="text-muted-foreground">Deep intelligence for strategic dominance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedMetric === 'performance' ? 'default' : 'outline'}
            onClick={() => setSelectedMetric('performance')}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Performance
          </Button>
          <Button
            variant={selectedMetric === 'utilization' ? 'default' : 'outline'}
            onClick={() => setSelectedMetric('utilization')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Utilization
          </Button>
          <Button
            variant={selectedMetric === 'efficiency' ? 'default' : 'outline'}
            onClick={() => setSelectedMetric('efficiency')}
          >
            <Activity className="mr-2 h-4 w-4" />
            Efficiency
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">On-Time Performance</p>
                <p className="text-2xl font-bold text-green-600">{currentMetrics.onTimePerformance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Delay</p>
                <p className="text-2xl font-bold text-yellow-600">{currentMetrics.avgDelay}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Network Efficiency</p>
                <p className="text-2xl font-bold text-blue-600">{currentMetrics.networkEfficiency}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Throughput</p>
                <p className="text-2xl font-bold text-purple-600">{currentMetrics.totalThroughput}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Peak Utilization</p>
                <p className="text-2xl font-bold text-red-600">{currentMetrics.peakUtilization.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Critical Nodes</p>
                <p className="text-2xl font-bold text-orange-600">{currentMetrics.criticalNodes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
        {/* Performance Over Time */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Analytics - 24H View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="On-Time %"
                />
                <Line
                  type="monotone"
                  dataKey="delayed"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Delayed %"
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Throughput"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Node Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Network Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-muted-foreground"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="utilization"
                  fill="#3b82f6"
                  name="Utilization %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Train Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Train Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trainTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => {
                    const total = trainTypeData.reduce((sum, item) => sum + item.value, 0);
                    const percent = total > 0 ? (Number(value) / total) * 100 : 0;
                    return `${name}: ${percent.toFixed(0)}%`
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trainTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value, name }) => {
                    const total = priorityData.reduce((sum, item) => sum + item.value, 0);
                    const percent = total > 0 ? (Number(value) / total) * 100 : 0;
                    return `${percent.toFixed(0)}%`
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {utilizationData
                .filter(node => node.utilization > 85)
                .map(node => (
                  <div key={node.name} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">{node.name}</p>
                      <p className="text-sm text-red-700 dark:text-red-300">High utilization detected</p>
                    </div>
                    <Badge variant="destructive">
                      {node.utilization.toFixed(1)}%
                    </Badge>
                  </div>
                ))}

              {utilizationData.filter(node => node.utilization > 85).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>All systems operating within normal parameters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}