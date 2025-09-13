export interface Node {
  id: string
  name: string
  type: "station" | "junction" | "terminal" | "yard" | "crossing"
  capacity: number
  lat: number
  lon: number
}

export interface Edge {
  id: string
  from: string
  to: string
  length: number
  maxSpeed: number
  capacity: number
  status: 'open' | 'closed'
}

export interface RailwayNetwork {
  nodes: Node[]
  edges: Edge[]
}

export interface TrainStop {
  node: string
  arrival: string
  departure: string
}

export interface Train {
  id: string
  type: "passenger" | "freight"
  priority: "high" | "medium" | "low"
  route: string[]
  schedule: TrainStop[]
  maxSpeed: number
  length: number
}

export interface Schedule {
  [trainId: string]: TrainStop[]
}

export interface SimulationOptions {
  speedFactor?: number
  includeWeather?: boolean
  randomEvents?: boolean
}

export interface SimulationEvent {
  trainId: string
  node: string
  scheduledArrival: string
  actualArrival: string
  delay: number
  conflict: boolean
  timestamp: string
}

export interface TimelineEvent {
  id: string
  trainId: string
  time: string
  location: string
  status: 'conflict' | 'delayed' | 'on_time'
  type: 'arrival' | 'departure' | 'conflict' | 'delay'
  details: SimulationEvent
}


export interface SimulationResults {
  events: SimulationEvent[]
  metrics: {
    totalTrains: number
    onTimePerformance: number
    averageDelay: number
    maxDelay: number
    resourceUtilization: number
    conflicts: number
  }
  timeline: TimelineEvent[]
  warnings: string[]
}

export interface OptimizationMetrics {
  objectiveValue: number
  constraintsSatisfied: number
  totalDelay: number
  utilization: number
  efficiency: number
  solvingTime: number
}

// THE FINAL UPGRADE: A decision now has a status to track the commander's will.
export interface Decision {
  id: string
  trainId: string
  action: 'hold' | 'proceed' | 'reroute' | 'merge'
  reason: string
  impact: number
  confidence: number
  status: 'pending' | 'accepted' | 'rejected'
}

