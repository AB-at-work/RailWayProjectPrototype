import type { RailwayNetwork, Train } from './types'; // Adjust the path as needed

/**
 * Validates the core data structures of the application. A critical safeguard
 * against corrupted or malformed input. This function is EXPORTED.
 */

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function validateInput(
  network: RailwayNetwork,
  trains: Train[],
): string | null {
  if (!network || !network.nodes || !network.edges) {
    return "Invalid network data structure"
  }
  if (!trains || !Array.isArray(trains)) {
    return "Invalid trains data structure"
  }
  for (const node of network.nodes) {
    if (!node.id || !node.type) {
      return `Invalid node configuration: ${JSON.stringify(node)}`
    }
  }
  for (const edge of network.edges) {
    if (!edge.id || !edge.from || !edge.to) {
      return `Invalid edge configuration: ${JSON.stringify(edge)}`
    }
  }
  for (const train of trains) {
    if (!train.id || !train.route || train.route.length === 0) {
      return `Invalid train configuration: ${JSON.stringify(train)}`
    }
  }
  return null
}

/**
 * Converts a time string in "HH:MM" format to total minutes since midnight.
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts total minutes since midnight back to "HH:MM" format.
 * Ensures values wrap correctly (e.g. 1500 minutes → 01:00 next day).
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
