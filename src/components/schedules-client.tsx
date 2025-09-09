"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { Badge } from "@/components/UI/badge"
import { Button } from "@/components/UI/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table"
import { RailwayNetwork, Train } from "@/lib/types"
import { Calendar, Clock, Route, Train as TrainIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SchedulesClientProps {
  initialNetwork: RailwayNetwork
  initialTrains: Train[]
}

export default function SchedulesClient({ initialNetwork, initialTrains }: SchedulesClientProps) {
  const [network] = useState<RailwayNetwork>(initialNetwork)
  const [trains] = useState<Train[]>(initialTrains)
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'timeline' | 'trains'>('timeline')

  // Generate timeline events from all trains
  const timelineEvents = trains
    .flatMap(train =>
      train.schedule.flatMap(stop => [
        {
          trainId: train.id,
          trainType: train.type,
          trainPriority: train.priority,
          node: stop.node,
          nodeName: network.nodes.find(n => n.id === stop.node)?.name || stop.node,
          time: stop.arrival,
          type: 'arrival' as const,
          status: 'scheduled' as const
        },
        {
          trainId: train.id,
          trainType: train.type,
          trainPriority: train.priority,
          node: stop.node,
          nodeName: network.nodes.find(n => n.id === stop.node)?.name || stop.node,
          time: stop.departure,
          type: 'departure' as const,
          status: 'scheduled' as const
        }
      ])
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 50) // Limit for performance

  const selectedTrainData = selectedTrain ? trains.find(t => t.id === selectedTrain) : null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="h-screen overflow-hidden p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Schedule Control</h1>
          <p className="text-muted-foreground">Master the flow of time across the network</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            onClick={() => setViewMode('timeline')}
          >
            <Clock className="mr-2 h-4 w-4" />
            Timeline View
          </Button>
          <Button
            variant={viewMode === 'trains' ? 'default' : 'outline'}
            onClick={() => setViewMode('trains')}
          >
            <TrainIcon className="mr-2 h-4 w-4" />
            Trains View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrainIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Trains</p>
                    <p className="text-2xl font-bold">{trains.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold">{trains.filter(t => t.priority === 'high').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Route className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Routes</p>
                    <p className="text-2xl font-bold">{trains.reduce((acc, t) => acc + t.route.length, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">On Schedule</p>
                    <p className="text-2xl font-bold">94.7%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Table */}
          {viewMode === 'timeline' ? (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Network Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Train</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timelineEvents.map((event, index) => (
                        <TableRow
                          key={`${event.trainId}-${event.time}-${event.type}-${index}`}
                          className={cn(
                            "cursor-pointer hover:bg-muted/50",
                            selectedTrain === event.trainId && "bg-primary/10"
                          )}
                          onClick={() => setSelectedTrain(event.trainId)}
                        >
                          <TableCell className="font-mono">{event.time}</TableCell>
                          <TableCell className="font-medium">{event.trainId}</TableCell>
                          <TableCell>
                            <Badge variant={event.type === 'arrival' ? 'proceed' : 'hold'}>
                              {event.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{event.nodeName}</TableCell>
                          <TableCell>
                            <span className={getPriorityColor(event.trainPriority)}>
                              {event.trainPriority.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrainIcon className="h-5 w-5" />
                  Train Schedules
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Train ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Stops</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trains.map((train) => {
                        const firstStop = train.schedule[0]
                        const lastStop = train.schedule[train.schedule.length - 1]
                        return (
                          <TableRow
                            key={train.id}
                            className={cn(
                              "cursor-pointer hover:bg-muted/50",
                              selectedTrain === train.id && "bg-primary/10"
                            )}
                            onClick={() => setSelectedTrain(train.id)}
                          >
                            <TableCell className="font-medium">{train.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{train.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPriorityVariant(train.priority)}>
                                {train.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {train.route.join(' → ')}
                            </TableCell>
                            <TableCell>{train.schedule.length}</TableCell>
                            <TableCell className="font-mono">
                              {firstStop?.departure} - {lastStop?.arrival}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          {selectedTrainData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrainIcon className="h-5 w-5" />
                  {selectedTrainData.id}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant="outline">{selectedTrainData.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <Badge variant={getPriorityVariant(selectedTrainData.priority)}>
                      {selectedTrainData.priority}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Schedule Details</p>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {selectedTrainData.schedule.map((stop, index) => (
                      <div key={`${stop.node}-${index}`} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium text-sm">
                            {network.nodes.find(n => n.id === stop.node)?.name || stop.node}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stop.arrival} → {stop.departure}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Max Speed</p>
                    <p className="font-semibold">{selectedTrainData.maxSpeed} km/h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Length</p>
                    <p className="font-semibold">{selectedTrainData.length}m</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedTrain(null)}
                >
                  Clear Selection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a train to view details</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Passenger Trains</span>
                <Badge variant="proceed">
                  {trains.filter(t => t.type === 'passenger').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Freight Trains</span>
                <Badge variant="hold">
                  {trains.filter(t => t.type === 'freight').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Schedule Time</span>
                <span className="text-sm font-semibold">1h 45m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Network Load</span>
                <Badge variant="reroute">Optimal</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}