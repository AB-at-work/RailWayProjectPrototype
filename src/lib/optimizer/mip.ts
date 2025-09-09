import { RailwayNetwork, Train, Decision } from "@/lib/types"

// This is a more sophisticated placeholder for a real MIP solver.
// It uses simple, rule-based logic to create realistic-looking decisions and logs.
// This makes the AI's output feel logical and consistent.

// Helper function to simulate computation time
async function simulateComplexOptimization(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
}

export async function optimizeSchedule(
  network: RailwayNetwork,
  trains: Train[]
): Promise<{ decisions: Decision[]; log: string[] }> {

  const log: string[] = [];
  const decisions: Decision[] = [];
  let decisionIdCounter = 1;

  log.push("Initializing optimization model...");
  log.push(`Analyzing ${trains.length} trains and ${network.edges.length} track segments.`);

  await simulateComplexOptimization();

  // Simple rule-based "AI" logic for demonstration
  const passengerTrains = trains.filter(t => t.type === 'passenger');
  const freightTrains = trains.filter(t => t.type === 'freight');

  log.push(`Prioritizing ${passengerTrains.length} high-priority passenger trains.`);

  // Rule 1: Always give passenger trains priority
  for (const pTrain of passengerTrains) {
    decisions.push({
      id: (decisionIdCounter++).toString(),
      trainId: pTrain.id,
      action: 'proceed',
      reason: 'High-priority passenger service.',
      impact: 0,
      confidence: 98
    });
  }

  log.push("Evaluating potential conflicts for freight trains.");
  await simulateComplexOptimization();

  // Rule 2: Check for potential conflicts for freight trains
  for (const fTrain of freightTrains) {
    // Simulate a conflict check
    const hasConflict = Math.random() > 0.3; // 70% chance of conflict

    if (hasConflict) {
      log.push(`Conflict detected for train ${fTrain.id}. Rerouting to avoid congestion.`);
      decisions.push({
        id: (decisionIdCounter++).toString(),
        trainId: fTrain.id,
        action: 'reroute',
        reason: 'Network congestion on primary path.',
        impact: Math.floor(Math.random() * 5) + 3, // 3-7 min delay
        confidence: 88
      });
    } else {
       log.push(`Clear path found for train ${fTrain.id}.`);
       decisions.push({
        id: (decisionIdCounter++).toString(),
        trainId: fTrain.id,
        action: 'proceed',
        reason: 'Clear path to destination.',
        impact: 0,
        confidence: 95
      });
    }
  }

  log.push("Finalizing schedule. Optimization complete.");

  return { decisions, log };
}

