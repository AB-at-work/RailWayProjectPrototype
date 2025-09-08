// utils/helpers.ts
import { RailwayNetwork, Train } from './types';

export function validateInput(network: RailwayNetwork, trains: Train[]): string | null {
  if (!network || !network.nodes || !network.edges) {
    return 'Invalid network data structure';
  }

  if (!trains || !Array.isArray(trains)) {
    return 'Invalid trains data structure';
  }

  // Validate network nodes
  for (const node of network.nodes) {
    if (!node.id || !node.type) {
      return `Invalid node configuration: ${JSON.stringify(node)}`;
    }
  }

  // Validate network edges
  for (const edge of network.edges) {
    if (!edge.id || !edge.from || !edge.to) {
      return `Invalid edge configuration: ${JSON.stringify(edge)}`;
    }
  }

  // Validate trains
  for (const train of trains) {
    if (!train.id || !train.route || train.route.length === 0) {
      return `Invalid train configuration: ${JSON.stringify(train)}`;
    }
  }

  return null;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = Math.floor(totalMinutes % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function calculateTravelTime(distance: number, maxSpeed: number): number {
  // Simple calculation: time = distance / speed (in hours, converted to minutes)
  return (distance / maxSpeed) * 60;
}