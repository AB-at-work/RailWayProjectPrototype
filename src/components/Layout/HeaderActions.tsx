"use client"

import { BrainCircuit, Play } from "lucide-react"
import { Button } from "@/components/UI/button"
import Link from "next/link"

// Keeping Optimize as a callback (since that's still logic in-page)
// but routing Simulation to the new /simulation page.
interface HeaderActionsProps {
  onOptimize: () => void
  isOptimizing: boolean
  isSimulating: boolean
}

export default function HeaderActions({
  onOptimize,
  isOptimizing,
  isSimulating,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Optimize stays as it was */}
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

      {/* Simulation now navigates to /simulation */}
      <Link href="/simulation">
        <Button
          disabled={isOptimizing || isSimulating}
          variant="secondary"
          size="sm"
        >
          <Play className="mr-2 h-4 w-4" />
          Run Simulation
        </Button>
      </Link>
    </div>
  )
}
