// lib/optimizer/heuristics.ts
// This import path is now corrected to the new source of truth.
import { RailwayNetwork, Train, Schedule, Node } from '@/lib/types';

export function heuristicSchedule(network: RailwayNetwork, trains: Train[]): { schedule: Schedule, metrics: any, log: string[] } {
  const log: string[] = [];
  log.push('Initializing heuristic optimization...');

  // Simple greedy heuristic for demonstration
  const optimizedSchedule: Schedule = {};

  trains.forEach(train => {
    log.push(`Processing train ${train.id}`);
    optimizedSchedule[train.id] = [];

    train.route.forEach((nodeId, index) => {
      const node = network.nodes.find(n => n.id === nodeId);
      if (!node) return;

      const originalTime = train.schedule[index]?.arrival || '00:00';
      const adjustedTime = adjustTimeBasedOnCongestion(originalTime, node, index);

      optimizedSchedule[train.id].push({
        node: nodeId,
        arrival: adjustedTime,
        departure: calculateDeparture(adjustedTime, node, train)
      });
    });
  });

  const metrics = calculateMetrics(optimizedSchedule, trains);
  log.push('Heuristic optimization completed');

  return { schedule: optimizedSchedule, metrics, log };
}

function adjustTimeBasedOnCongestion(baseTime: string, node: Node, order: number): string {
  // Simple congestion adjustment logic
  const congestionFactor = node.capacity / (order + 1);
  const [hours, minutes] = baseTime.split(':').map(Number);
  const adjustedMinutes = Math.floor(minutes * (1 + (1 - congestionFactor) * 0.1)); // A more subtle adjustment

  const adjustmentTime = new Date();
  adjustmentTime.setHours(hours);
  adjustmentTime.setMinutes(minutes + adjustedMinutes);

  return `${String(adjustmentTime.getHours()).padStart(2, '0')}:${String(adjustmentTime.getMinutes()).padStart(2, '0')}`;
}

function calculateDeparture(arrival: string, node: Node, train: Train): string {
  const [hours, minutes] = arrival.split(':').map(Number);
  const dwellTime = train.type === 'passenger' ? 2 : 5; // Dwell time in minutes

  const departureTime = new Date();
  departureTime.setHours(hours);
  departureTime.setMinutes(minutes + dwellTime);

  return `${String(departureTime.getHours()).padStart(2, '0')}:${String(departureTime.getMinutes()).padStart(2, '0')}`;
}

function calculateMetrics(schedule: Schedule, trains: Train[]): any {
  // Calculate basic performance metrics
  return {
    totalTrains: trains.length,
    totalDelay: 0, // Placeholder
    utilization: 87, // Placeholder
    efficiency: 92, // Placeholder
  };
}

