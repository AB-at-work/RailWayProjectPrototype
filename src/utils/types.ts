// utils/types.ts
export interface Node {
  id: string;
  name: string;
  type: 'station' | 'junction' | 'terminal' | 'yard' | 'crossing';
  capacity: number;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  length: number;
  maxSpeed: number;
  capacity: number;
}

export interface RailwayNetwork {
  nodes: Node[];
  edges: Edge[];
}

export interface Train {
  id: string;
  type: 'passenger' | 'freight';
  priority: 'high' | 'medium' | 'low';
  route: string[];
  schedule: TrainStop[];
  maxSpeed: number;
  length: number;
}

export interface TrainStop {
  node: string;
  arrival: string;
  departure: string;
}

export interface Schedule {
  [trainId: string]: TrainStop[];
}

export interface SimulationOptions {
  speedFactor?: number;
  includeWeather?: boolean;
  randomEvents?: boolean;
}

export interface SimulationEvent {
  trainId: string;
  node: string;
  scheduledArrival: string;
  actualArrival: string;
  delay: number;
  conflict: boolean;
  timestamp: string;
}

export interface TimelineEvent {
  time: string;
  train: string;
  location: string;
  event: string;
  details: SimulationEvent;
}

export interface SimulationResults {
  events: SimulationEvent[];
  metrics: {
    totalTrains: number;
    onTimePerformance: number;
    averageDelay: number;
    maxDelay: number;
    resourceUtilization: number;
    conflicts: number;
  };
  timeline: TimelineEvent[];
  warnings: string[];
}

export interface OptimizationMetrics {
  objectiveValue: number;
  constraintsSatisfied: number;
  totalDelay: number;
  utilization: number;
  efficiency: number;
  solvingTime: number;
}