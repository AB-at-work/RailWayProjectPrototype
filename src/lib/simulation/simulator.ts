// lib/simulation/simulator.ts
import { RailwayNetwork, Schedule, SimulationOptions, SimulationResults, SimulationEvent, TimelineEvent } from '@/utils/types';

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
      const delay = Math.random() * 5; // Random delay between 0-5 minutes
      const hasConflict = Math.random() > 0.8; // 20% chance of conflict

      events.push({
        trainId,
        node: stop.node,
        scheduledArrival: stop.arrival,
        actualArrival: addDelay(stop.arrival, delay),
        delay,
        conflict: hasConflict,
        timestamp: new Date().toISOString()
      });

      if (hasConflict) metrics.conflicts++;
    });
  });

  // Calculate performance metrics
  metrics.onTimePerformance = calculateOnTimePerformance(events);
  metrics.averageDelay = calculateAverageDelay(events);
  metrics.maxDelay = calculateMaxDelay(events);
  metrics.resourceUtilization = calculateResourceUtilization(network, events);

  return {
    events,
    metrics,
    timeline: generateTimeline(events),
    warnings: metrics.conflicts > 0 ? [`${metrics.conflicts} conflicts detected`] : []
  };
}

function addDelay(time: string, delayMinutes: number): string {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + delayMinutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = Math.floor(totalMinutes % 60);
  return `${newHours}:${newMinutes.toString().padStart(2, '0')}`;
}

function calculateOnTimePerformance(events: SimulationEvent[]): number {
  const onTimeEvents = events.filter(event => event.delay <= 2);
  return (onTimeEvents.length / events.length) * 100;
}

function calculateAverageDelay(events: SimulationEvent[]): number {
  return events.reduce((sum, event) => sum + event.delay, 0) / events.length;
}

function calculateMaxDelay(events: SimulationEvent[]): number {
  return Math.max(...events.map(event => event.delay));
}

function calculateResourceUtilization(network: RailwayNetwork, events: SimulationEvent[]): number {
  const totalCapacity = network.nodes.reduce((sum, node) => sum + node.capacity, 0);
  const averageUtilization = events.length / totalCapacity;
  return Math.min(averageUtilization * 100, 100);
}

function generateTimeline(events: SimulationEvent[]): TimelineEvent[] {
  return events
    .sort((a, b) => a.actualArrival.localeCompare(b.actualArrival))
    .map(event => ({
      time: event.actualArrival,
      train: event.trainId,
      location: event.node,
      event: event.conflict ? 'conflict' : 'arrival',
      details: event
    }));
}