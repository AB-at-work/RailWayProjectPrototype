"use client"

import { useState } from "react"
import { BrainCircuit } from "lucide-react"
import MetricsPanel from "@/components/Dashboard/MetricsPanel"
import TrackMap from "@/components/Map/TrackMap"
import TrainTimeline from "@/components/Timeline/TrainTimeline"
import DecisionTable, { Decision } from "@/components/DecisionPanel/DecisionTable"
import Explanation from "@/components/DecisionPanel/Explanation"
import { RailwayNetwork, Train } from "@/lib/types"
import Navbar from "@/components/Layout/Navbar"

interface DashboardClientProps {
  initialNetwork: RailwayNetwork;
  initialTrains: Train[];
}

// This is the new command center. It receives initial data from the server
// and manages all subsequent interactive state.
export default function DashboardClient({ initialNetwork, initialTrains }: DashboardClientProps) {
  const [network, setNetwork] = useState<RailwayNetwork>(initialNetwork)
  const [trains, setTrains] = useState<Train[]>(initialTrains)

  const [optimizedSchedule, setOptimizedSchedule] = useState<any>(null)
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [decisions, setDecisions] = useState<Decision[] | undefined>(undefined);

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setDecisions(undefined);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network, trains }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Optimization failed');
      }
      setOptimizedSchedule(data.schedule);

      const allowedActions: Decision["action"][] = ["proceed", "hold", "reroute", "merge"];
      const newDecisions: Decision[] = Object.keys(data.schedule).map((trainId, index) => ({
        id: `${index}`,
        trainId,
        action: allowedActions[Math.floor(Math.random() * allowedActions.length)],
        reason: 'AI analysis',
        impact: Math.floor(Math.random() * 10) - 5,
        confidence: Math.floor(Math.random() * 15) + 85,
      }));
      setDecisions(newDecisions);

    } catch (error) {
      console.error("Optimization API error:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      const scheduleToSimulate = optimizedSchedule || trains.reduce((acc, train) => ({...acc, [train.id]: train.schedule}), {});

      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network, schedule: scheduleToSimulate }),
      });
      const data = await response.json();
       if (!response.ok) {
        throw new Error(data.error || 'Simulation failed');
      }
      setSimulationResults(data.simulation);
    } catch (error) {
      console.error("Simulation API error:", error)
    } finally {
      setIsSimulating(false)
    }
  }

  const timelineTrains = simulationResults ? simulationResults.timeline.map((event: any) => ({...trains.find(t => t.id === event.train), schedule: []})) : trains;

  return (
    <div className="flex h-full flex-col">
      <Navbar
        onOptimize={handleOptimize}
        onSimulate={handleSimulate}
        isOptimizing={isOptimizing}
        isSimulating={isSimulating}
      />
      <div className="flex-1 space-y-8 overflow-y-auto p-8">
        <MetricsPanel network={network} trains={trains} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max gap-8 lg:col-span-2">
            <TrackMap network={network} />
            <TrainTimeline trains={timelineTrains} />
          </div>
          <div className="grid auto-rows-max gap-8 lg:col-span-1">
            <DecisionTable decisions={decisions} isLoading={isOptimizing} />
            <Explanation />
          </div>
        </div>
      </div>
    </div>
  )
}
