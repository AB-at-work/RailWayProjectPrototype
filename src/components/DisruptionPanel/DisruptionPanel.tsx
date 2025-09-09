"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select"
import { Button } from "@/components/UI/button"
import { RailwayNetwork } from "@/lib/types"
import { AlertTriangle, ShieldCheck } from "lucide-react"

interface DisruptionPanelProps {
  network: RailwayNetwork
  onDisrupt: (edgeId: string) => void
  onReset: () => void
  disabled: boolean
}

export default function DisruptionPanel({ network, onDisrupt, onReset, disabled }: DisruptionPanelProps) {
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)

  const handleApplyDisruption = () => {
    if (selectedEdge) {
      onDisrupt(selectedEdge)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Disruption Control
        </CardTitle>
        <CardDescription>
          Simulate real-time track closures to test network resilience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="track-select" className="mb-2 block text-sm font-medium text-muted-foreground">
            Select Track to Close
          </label>
          <Select
            onValueChange={setSelectedEdge}
            disabled={disabled}
          >
            <SelectTrigger id="track-select">
              <SelectValue placeholder="Select a track..." />
            </SelectTrigger>
            <SelectContent>
              {network.edges.map((edge) => (
                <SelectItem key={edge.id} value={edge.id} disabled={edge.status === 'closed'}>
                  {edge.id}: {network.nodes.find(n => n.id === edge.from)?.name} → {network.nodes.find(n => n.id === edge.to)?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleApplyDisruption}
            disabled={!selectedEdge || disabled}
            variant="destructive"
            className="w-full"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Apply Disruption
          </Button>
          <Button
            onClick={onReset}
            disabled={disabled}
            variant="outline"
            className="w-full"
          >
             <ShieldCheck className="mr-2 h-4 w-4" />
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
