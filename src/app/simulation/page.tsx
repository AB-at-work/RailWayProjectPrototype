// src/app/simulation/page.tsx
"use client";

import { useState } from "react";
import { runSimulation } from "@/lib/simulation/simulator";
import networkData from "@/lib/data/network.json";
import trainData from "@/lib/data/trains.json";
import { Schedule, RailwayNetwork } from "@/lib/types";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/UI/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table";
import { Badge } from "@/components/UI/badge";
import { Play, AlertTriangle, CheckCircle2, List, Hourglass } from "lucide-react";
import { cn } from "@/lib/utils";

// Re-cast the imported JSON to the correct type
const network: RailwayNetwork = networkData as RailwayNetwork;
const trains = trainData;

export default function SimulationPage() {
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const buildSchedule = (): Schedule => {
    const schedule: Schedule = {};
    trains.trains.forEach((train: any) => {
      schedule[train.id] = train.schedule.map((stop: any) => ({
        node: stop.node,
        arrival: stop.arrival,
        departure: stop.departure,
      }));
    });
    return schedule;
  };

  const handleRunSimulation = () => {
    setLoading(true);
    setResults(null);
    // Use a timeout to simulate a computation and allow the UI to update
    setTimeout(() => {
      try {
        const schedule = buildSchedule();
        const simResults = runSimulation(network, schedule, { randomEvents: true });
        setResults(simResults);
      } catch (err) {
        console.error("Simulation error:", err);
        alert("Simulation failed. Check console for details.");
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "conflict": return "destructive";
      case "delayed": return "hold"; // Using 'hold' variant for yellow color
      default: return "proceed"; // Using 'proceed' variant for green color
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Simulation Environment</h1>
        <p className="text-muted-foreground">Test network resilience and predict outcomes under various conditions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run New Simulation</CardTitle>
          <CardDescription>
            Trigger a full simulation based on the baseline schedule and random disruption events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRunSimulation} disabled={loading} size="lg">
            {loading ? (
              <>
                <Hourglass className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Full Simulation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">On-Time Performance</span>
                  <Badge variant="proceed">{results.metrics.onTimePerformance.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Delay</span>
                  <Badge variant="hold">{results.metrics.averageDelay.toFixed(1)} mins</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Conflicts Detected</span>
                  <Badge variant="destructive">{results.metrics.conflicts}</Badge>
                </div>
              </CardContent>
            </Card>
             {results.warnings && results.warnings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {results.warnings.map((w: string, idx: number) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
             )}
          </div>
          <div className="lg:col-span-2">
             <Card>
              <CardHeader>
                <CardTitle>Timeline of Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Train</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Delay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.timeline.map((event: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono">{event.time}</TableCell>
                          <TableCell className="font-medium">{event.trainId}</TableCell>
                          <TableCell>{network.nodes.find(n => n.id === event.location)?.name || event.location}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(event.status)}>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className={cn("text-right font-semibold", event.details.delay > 0 && "text-destructive")}>
                            {event.details.delay} min
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}