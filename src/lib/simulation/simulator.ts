// lib/simulation/simulator.ts
// All import paths are now corrected to the new source of truth in /lib.
import { RailwayNetwork, Schedule, SimulationOptions, SimulationResults, SimulationEvent, TimelineEvent } from '@/lib/types';
import { timeToMinutes, minutesToTime } from '@/lib/utils';


export function runSimulation(network: RailwayNetwork, schedule: Schedule, options?: SimulationOptions): SimulationResults {
  const events: SimulationEvent[] = [];
  const metrics = {
    totalTrains: Object.keys(schedule).length,
    onTimePerformance: 0,
    averageDelay: 0,
    maxDelay: 0,
    resourceUtilization: 0,
    conflicts: 0
  };

  // Simulate train movements through the network
  Object.entries(schedule).forEach(([trainId, trainSchedule]) => {
    trainSchedule.forEach((stop, index) => {
      // Simulate potential delays and events
      // We'll make the simulation slightly more realistic.
      const isDelayed = Math.random() > (options?.randomEvents ? 0.7 : 0.9); // 30% chance of delay if random events are on
      const delay = isDelayed ? Math.floor(Math.random() * 10) + 1 : 0; // Random delay between 1-10 minutes
      const hasConflict = Math.random() > 0.8; // 20% chance of conflict

      const actualArrivalTime = addDelay(stop.arrival, delay);

      events.push({
        trainId,
        node: stop.node,
        scheduledArrival: stop.arrival,
        actualArrival: actualArrivalTime,
        delay,
        conflict: hasConflict,
        timestamp: new Date().toISOString()
      });

      if (hasConflict) metrics.conflicts++;
    });
  });

  // Calculate performance metrics from the generated events
  metrics.onTimePerformance = calculateOnTimePerformance(events);
  metrics.averageDelay = calculateAverageDelay(events);
  metrics.maxDelay = calculateMaxDelay(events);
  metrics.resourceUtilization = calculateResourceUtilization(network, events);

  return {
    events,
    metrics,
    timeline: generateTimeline(events),
    warnings: metrics.conflicts > 0 ? [`${metrics.conflicts} potential conflicts detected`] : []
  };
}

// A more robust way to handle time addition using our utility functions.
function addDelay(time: string, delayMinutes: number): string {
  if (delayMinutes === 0) return time;
  const totalMinutes = timeToMinutes(time) + delayMinutes;
  return minutesToTime(totalMinutes);
}

function calculateOnTimePerformance(events: SimulationEvent[]): number {
  if (events.length === 0) return 100;
  const onTimeThreshold = 5; // Trains delayed by 5 mins or less are "on time"
  const onTimeEvents = events.filter(event => event.delay <= onTimeThreshold);
  return (onTimeEvents.length / events.length) * 100;
}

function calculateAverageDelay(events: SimulationEvent[]): number {
  if (events.length === 0) return 0;
  return events.reduce((sum, event) => sum + event.delay, 0) / events.length;
}

function calculateMaxDelay(events: SimulationEvent[]): number {
    if (events.length === 0) return 0;
  return Math.max(...events.map(event => event.delay));
}

function calculateResourceUtilization(network: RailwayNetwork, events: SimulationEvent[]): number {
  // A simplified placeholder for a very complex calculation.
  const totalCapacity = network.nodes.reduce((sum, node) => sum + node.capacity, 0);
  if (totalCapacity === 0) return 0;
  // Let's assume each event occupies a resource for an average of 15 minutes.
  const totalOccupancyMinutes = events.length * 15;
  const totalAvailableMinutes = totalCapacity * 60; // Assuming a 1-hour window.
  const utilization = (totalOccupancyMinutes / totalAvailableMinutes) * 100;
  return Math.min(utilization, 100); // Cap at 100%
}

function generateTimeline(events: SimulationEvent[]): TimelineEvent[] {
  return events
    .sort((a, b) => timeToMinutes(a.actualArrival) - timeToMinutes(b.actualArrival))
    .map((event, idx) => ({
      id: `${event.trainId}-${event.node}-${event.actualArrival}-${idx}`,
      trainId: event.trainId,
      time: event.actualArrival,
      location: event.node,
      status: event.conflict ? 'conflict' : (event.delay > 0 ? 'delayed' : 'on_time'),
      type: event.conflict ? 'conflict' : (event.delay > 0 ? 'delay' : 'arrival'),
      details: event,
      train: event.trainId, // Added property
      event: event.conflict ? 'conflict' : (event.delay > 0 ? 'delay' : 'arrival') // Changed to string type
    }));
}

