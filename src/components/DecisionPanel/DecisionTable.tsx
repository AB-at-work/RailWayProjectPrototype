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
import { Decision } from "@/lib/types" // It now imports the law from the single source of truth.

// The local, flawed definition has been annihilated.

const placeholderDecisions: Decision[] = [
    { id: '1', trainId: 'T-234', action: 'hold', reason: 'Conflict at Junction B', impact: -2, confidence: 92, status: 'pending' },
    { id: '2', trainId: 'T-567', action: 'proceed', reason: 'Clear path to destination', impact: 0, confidence: 98, status: 'pending' },
    { id: '3', trainId: 'T-891', action: 'reroute', reason: 'Track maintenance on primary route', impact: 5, confidence: 85, status: 'pending' }
];

interface DecisionTableProps {
  decisions?: Decision[]
  isLoading: boolean
}

// The component now uses the placeholder with the correct 'status' property.
export default function DecisionTable({ decisions, isLoading }: DecisionTableProps) {
  const displayDecisions = decisions && decisions.length > 0 ? decisions : placeholderDecisions;

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
              displayDecisions.map((decision) => (
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

