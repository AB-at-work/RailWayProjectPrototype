"use client"

import { BrainCircuit, Play } from "lucide-react"
import { Button } from "@/components/UI/button"

// This component is now a pure vessel for the user's will.
// It receives its state and its commands from the command center (page.tsx).
interface HeaderActionsProps {
  onOptimize: () => void
  onSimulate: () => void
  isOptimizing: boolean
  isSimulating: boolean
}

export default function HeaderActions({
  onOptimize,
  onSimulate,
  isOptimizing,
  isSimulating,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={onOptimize}
        disabled={isOptimizing || isSimulating}
        size="sm"
      >
        {isOptimizing ? (
          <>
            <BrainCircuit className="mr-2 h-4 w-4 animate-spin" />
            Optimizing...
          </>
        ) : (
          <>
            <BrainCircuit className="mr-2 h-4 w-4" />
            Optimize Schedule
          </>
        )}
      </Button>
      <Button
        onClick={onSimulate}
        disabled={isOptimizing || isSimulating}
        variant="secondary"
        size="sm"
      >
        {isSimulating ? (
          <>
            <Play className="mr-2 h-4 w-4 animate-pulse" />
            Simulating...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Run Simulation
          </>
        )}
      </Button>
    </div>
  )
}

