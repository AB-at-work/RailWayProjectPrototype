"use client"

import { Badge } from "@/components/UI/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table"

// This component is no longer static. It is a dynamic display for API results.
// We define a clear type for the decisions it will receive.
export interface Decision {
  id: string
  trainId: string
  action: 'hold' | 'proceed' | 'reroute' | 'merge'
  reason: string
  impact: number
  confidence: number
}

// The default, hardcoded data is now just a placeholder for the initial view.
const placeholderDecisions: Decision[] = [
    { id: '1', trainId: 'T-234', action: 'hold', reason: 'Conflict at Junction B', impact: -2, confidence: 92 },
    { id: '2', trainId: 'T-567', action: 'proceed', reason: 'Clear path to destination', impact: 0, confidence: 98 },
    { id: '3', trainId: 'T-891', action: 'reroute', reason: 'Track maintenance on primary route', impact: 5, confidence: 85 }
];


interface DecisionTableProps {
  decisions?: Decision[] // The decisions are now optional props.
  isLoading: boolean
}

export default function DecisionTable({ decisions = placeholderDecisions, isLoading }: DecisionTableProps) {
  const getActionVariant = (action: Decision['action']) => {
    switch (action) {
      case 'hold': return 'hold';
      case 'proceed': return 'proceed';
      case 'reroute': return 'reroute';
      default: return 'default';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Actions</CardTitle>
        <CardDescription>
          AI-generated recommendations to optimize network flow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Impact (min)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Calculating optimal schedule...
                </TableCell>
              </TableRow>
            ) : (
              decisions.map((decision) => (
                <TableRow key={decision.id}>
                  <TableCell className="font-medium">{decision.trainId}</TableCell>
                  <TableCell>
                    <Badge variant={getActionVariant(decision.action)}>{decision.action}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${decision.impact < 0 ? 'text-destructive' : 'text-green-500'}`}>
                    {decision.impact > 0 ? `+${decision.impact}`: decision.impact}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

