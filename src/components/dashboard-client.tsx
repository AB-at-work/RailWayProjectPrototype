"use client"

import { useState } from "react"
import MetricsPanel from "@/components/Dashboard/MetricsPanel"
import TrackMap from "@/components/Map/TrackMap"
import TrainTimeline from "@/components/Timeline/TrainTimeline"
import DecisionTable, { Decision } from "@/components/DecisionPanel/DecisionTable"
import Explanation from "@/components/DecisionPanel/Explanation"
import { RailwayNetwork, Train, Edge } from "@/lib/types"
import Navbar from "@/components/Layout/Navbar"
import DisruptionPanel from "@/components/DisruptionPanel/disruptionpanel"

interface DashboardClientProps {
  initialNetwork: RailwayNetwork
  initialTrains: Train[]
}

export default function DashboardClient({ initialNetwork, initialTrains }: DashboardClientProps) {
  // The network is no longer a constant; it is a mutable state that can be disrupted.
  const [network, setNetwork] = useState<RailwayNetwork>(initialNetwork)
  const [trains, setTrains] = useState<Train[]>(initialTrains)

  const [optimizedSchedule, setOptimizedSchedule] = useState<any>(null)
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [decisions, setDecisions] = useState<Decision[] | undefined>(undefined)
  const [optimizationLog, setOptimizationLog] = useState<string[] | undefined>(undefined)

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setDecisions(undefined)
    setOptimizationLog(undefined)
    try {
      // The optimizer now receives the CURRENT state of the network, including any disruptions.
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network, trains }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Optimization failed")
      }
      setOptimizedSchedule(data.schedule)
      setDecisions(data.decisions)
      setOptimizationLog(data.log)
    } catch (error) {
      console.error("Optimization API error:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      const scheduleToSimulate = optimizedSchedule || trains.reduce((acc, train) => ({ ...acc, [train.id]: train.schedule }), {})
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The simulator also receives the CURRENT, potentially disrupted network state.
        body: JSON.stringify({ network, schedule: scheduleToSimulate }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Simulation failed")
      }
      setSimulationResults(data.simulation)
    } catch (error) {
      console.error("Simulation API error:", error)
    } finally {
      setIsSimulating(false)
    }
  }

  // COMMAND: Introduce Disruption
  const handleDisruption = (edgeId: string) => {
    setNetwork(currentNetwork => {
      const newEdges = currentNetwork.edges.map(edge =>
        edge.id === edgeId ? { ...edge, status: 'closed' as Edge['status'] } : edge
      );
      return { ...currentNetwork, edges: newEdges };
    });
  };

  // COMMAND: Reset Disruptions
  const handleReset = () => {
    setNetwork(currentNetwork => {
      const newEdges = currentNetwork.edges.map(edge => ({ ...edge, status: 'open' as Edge['status'] }));
      return { ...currentNetwork, edges: newEdges };
    });
  };

  const timelineTrains = simulationResults ? simulationResults.timeline.map((event: any) => ({ ...trains.find(t => t.id === event.train), schedule: [] })) : trains

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
            <DisruptionPanel
              network={network}
              onDisrupt={handleDisruption}
              onReset={handleReset}
              disabled={isOptimizing || isSimulating}
            />
            <Explanation log={optimizationLog} isLoading={isOptimizing} />
          </div>
        </div>
      </div>
    </div>
  )
}

