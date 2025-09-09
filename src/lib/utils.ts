// lib/utils.ts
// This is the single, immutable source of truth for all utility functions.
// All other versions are heresy.

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RailwayNetwork, Train } from "./types"

// --- UI UTILITIES ---

/**
 * A master utility for merging Tailwind CSS classes. This is a non-negotiable
 * tool for building scalable and conflict-free component styles.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- DATA VALIDATION UTILITIES ---

/**
 * Validates the core data structures of the application. A critical safeguard
 * against corrupted or malformed input. This function is EXPORTED.
 */
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
    if (!node.id || !node.type || !node.coords) {
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

// --- TIME UTILITIES ---

/**
 * Converts a "HH:MM" time string into total minutes from midnight.
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/**
 * Converts total minutes from midnight into a "HH:MM" time string.
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = Math.floor(totalMinutes % 60)
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`
}

/**
 * A simple travel time calculation. This can be expanded with more complex
 * physics and network state logic in the future.
 */
export function calculateTravelTime(distance: number, maxSpeed: number): number {
  return (distance / maxSpeed) * 60
}