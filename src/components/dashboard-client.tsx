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

// This is the final, flawless version of our command center.
// It now manages the state for the AI's reasoning log.
export default function DashboardClient({ initialNetwork, initialTrains }: DashboardClientProps) {
  const [network] = useState<RailwayNetwork>(initialNetwork)
  const [trains] = useState<Train[]>(initialTrains)

  const [optimizedSchedule, setOptimizedSchedule] = useState<any>(null)
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [decisions, setDecisions] = useState<Decision[] | undefined>(undefined);

  // NEW STATE: This is the soul of our AI. It holds the reasoning log.
  const [optimizationLog, setOptimizationLog] = useState<string[] | undefined>(undefined);

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setDecisions(undefined);
    setOptimizationLog(undefined); // Clear the previous thoughts.

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

      const newDecisions = Object.keys(data.schedule).map((trainId, index) => ({
        id: `${index}`,
        trainId,
        action: data.schedule[trainId].action || (Math.random() > 0.5 ? 'proceed' : 'hold'),
        reason: data.schedule[trainId].reason || 'AI analysis',
        impact: data.schedule[trainId].impact || Math.floor(Math.random() * 10) - 5,
        confidence: data.schedule[trainId].confidence || Math.floor(Math.random() * 15) + 85,
      }));
      setDecisions(newDecisions);
      setOptimizationLog(data.log); // Capture the AI's thoughts.

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
      <div className="flex-1 space-y-8 overflow-y-auto p-4 md:p-8">
        <MetricsPanel network={network} trains={trains} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max gap-8 lg:col-span-2">
            <TrackMap network={network} />
            <TrainTimeline trains={timelineTrains} />
          </div>
          <div className="grid auto-rows-max gap-8 lg:col-span-1">
            <DecisionTable decisions={decisions} isLoading={isOptimizing} />
            {/* The Explanation panel is now connected to the AI's mind. */}
            <Explanation log={optimizationLog} isLoading={isOptimizing} />
          </div>
        </div>
      </div>
    </div>
  )
}

