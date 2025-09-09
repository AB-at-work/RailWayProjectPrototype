"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { BrainCircuit, ListChecks } from "lucide-react"

interface ExplanationProps {
  log: string[] | undefined
  isLoading: boolean
}

// This is the new standard. Simple, robust, and flawless.
export default function Explanation({ log, isLoading }: ExplanationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          Optimization Rationale
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <BrainCircuit className="h-5 w-5 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        {!isLoading && (!log || log.length === 0) && (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-muted-foreground">
              Click "Optimize Schedule" to view the AI's reasoning.
            </p>
          </div>
        )}
        {!isLoading && log && log.length > 0 && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground h-40 overflow-y-auto">
            <ul className="space-y-1">
              {log.map((entry, index) => (
                <li key={index} className="text-xs">{entry}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

