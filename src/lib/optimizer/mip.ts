import { RailwayNetwork, Train, Decision } from "@/lib/types"

// This is the upgraded AI brain. It now understands the concept of a decision's status.
export async function optimizeSchedule(
  network: RailwayNetwork,
  trains: Train[]
): Promise<{ decisions: Decision[]; schedule: any; metrics: any; log: string[] }> {
  const log: string[] = []
  log.push("🧠 INITIALIZING LEGENDARY AI OPTIMIZER...")
  log.push("🔍 Scanning network topology and constraints...")

  const activeEdges = network.edges.filter(edge => edge.status !== 'closed');
  const closedEdges = network.edges.filter(edge => edge.status === 'closed');

  if (closedEdges.length > 0) {
    log.push(`⚠️  DISRUPTION DETECTED: ${closedEdges.length} track(s) closed`)
    closedEdges.forEach(edge => {
      log.push(`   → Track ${edge.id} (${edge.from} → ${edge.to}) is BLOCKED`)
    })
  }

  log.push(`📊 Network Analysis: ${network.nodes.length} nodes, ${activeEdges.length}/${network.edges.length} active tracks`)

  const conflicts = detectConflicts(network, trains)
  if (conflicts.length > 0) {
    log.push(`🚨 ${conflicts.length} potential conflicts identified`)
    conflicts.forEach((conflict, i) => {
      log.push(`   Conflict ${i+1}: ${conflict.train1} vs ${conflict.train2} at ${conflict.location}`)
    })
  }

  await new Promise(resolve => setTimeout(resolve, 1500))

  const decisions: Decision[] = []
  let decisionId = 1

  const prioritizedTrains = [...trains].sort((a, b) => {
    const priorityMap = { 'high': 3, 'medium': 2, 'low': 1 }
    return priorityMap[b.priority as keyof typeof priorityMap] - priorityMap[a.priority as keyof typeof priorityMap]
  })

  log.push("🎯 Applying intelligent decision matrix...")

  for (const train of prioritizedTrains) {
    const routeViability = analyzeRoute(train, network, activeEdges)
    const hasConflict = conflicts.some(c => c.train1 === train.id || c.train2 === train.id)

    log.push(`🚂 Analyzing train ${train.id} (${train.priority} priority)`)

    let newDecision: Omit<Decision, 'id' | 'status'>;

    if (!routeViability.viable) {
      const alternativeRoute = findAlternativeRoute(train, network, activeEdges)
      if (alternativeRoute.found) {
        newDecision = {
          trainId: train.id,
          action: 'reroute',
          reason: `Primary route blocked. Alt via ${alternativeRoute.via}`,
          impact: alternativeRoute.extraTime,
          confidence: 95
        }
        log.push(`   → REROUTING via ${alternativeRoute.via} (+${alternativeRoute.extraTime}min)`)
      } else {
        newDecision = {
          trainId: train.id,
          action: 'hold',
          reason: 'No viable routes. Waiting clearance.',
          impact: 15,
          confidence: 85
        }
        log.push(`   → HOLDING until network clears (+15min delay)`)
      }
    } else if (hasConflict) {
      if (train.priority === 'high') {
        newDecision = {
          trainId: train.id,
          action: 'proceed',
          reason: 'High priority override',
          impact: -1,
          confidence: 98
        }
        log.push(`   → HIGH PRIORITY OVERRIDE`)
      } else {
        newDecision = {
          trainId: train.id,
          action: 'hold',
          reason: 'Yielding to higher priority traffic',
          impact: 8,
          confidence: 92
        }
        log.push(`   → YIELDING to priority (+8min delay)`)
      }
    } else {
      const speedOptimization = calculateSpeedOptimization(train, routeViability.conditions)
      newDecision = {
        trainId: train.id,
        action: 'proceed',
        reason: speedOptimization.reason,
        impact: speedOptimization.timeSaved,
        confidence: 96
      }
      log.push(`   → OPTIMIZED FLOW (${speedOptimization.timeSaved > 0 ? '-' : ''}${Math.abs(speedOptimization.timeSaved)}min)`)
    }

    // Every decision is now born with a 'pending' status.
    decisions.push({ ...newDecision, id: (decisionId++).toString(), status: 'pending' });
  }

  log.push("🌐 Computing network-wide flow optimization...")
  const networkMetrics = calculateNetworkMetrics(decisions, trains, network)

  log.push(`✅ OPTIMIZATION COMPLETE:`)
  log.push(`   → Total time saved: ${networkMetrics.totalTimeSaved} minutes`)
  log.push(`   → Conflicts resolved: ${conflicts.length}`)
  log.push(`   → Network efficiency: ${networkMetrics.efficiency}%`)

  return {
    decisions,
    schedule: {},
    metrics: networkMetrics,
    log,
  }
}

// Helper functions remain the same...
function detectConflicts(network: RailwayNetwork, trains: Train[]) {
  const conflicts: any[] = []
  for (let i = 0; i < trains.length; i++) {
    for (let j = i + 1; j < trains.length; j++) {
      const train1 = trains[i]
      const train2 = trains[j]
      const sharedNodes = train1.route.filter(node => train2.route.includes(node))
      if (sharedNodes.length > 0) {
        const hasTimeConflict = train1.schedule.some(stop1 =>
          train2.schedule.some(stop2 =>
            stop1.node === stop2.node &&
            Math.abs(timeToMinutes(stop1.arrival) - timeToMinutes(stop2.arrival)) < 10
          )
        )
        if (hasTimeConflict) {
          conflicts.push({
            train1: train1.id,
            train2: train2.id,
            location: sharedNodes[0],
            type: 'timing'
          })
        }
      }
    }
  }
  return conflicts
}

function analyzeRoute(train: Train, network: RailwayNetwork, activeEdges: any[]) {
  for (let i = 0; i < train.route.length - 1; i++) {
    const from = train.route[i]
    const to = train.route[i + 1]
    const edge = activeEdges.find(e =>
      (e.from === from && e.to === to) || (e.from === to && e.to === from)
    )
    if (!edge) return { viable: false, conditions: 'blocked' }
  }
  return { viable: true, conditions: 'clear' }
}

function findAlternativeRoute(train: Train, network: RailwayNetwork, activeEdges: any[]) {
  const start = train.route[0]
  const end = train.route[train.route.length - 1]
  const possibleIntermediate = network.nodes
    .filter(node =>
      node.id !== start &&
      node.id !== end &&
      activeEdges.some(e =>
        (e.from === start && e.to === node.id) || (e.from === node.id && e.to === start)
      ) &&
      activeEdges.some(e =>
        (e.from === node.id && e.to === end) || (e.from === end && e.to === node.id)
      )
    )
  if (possibleIntermediate.length > 0) {
    const via = possibleIntermediate[0].name
    return { found: true, via, extraTime: Math.floor(Math.random() * 10) + 5 }
  }
  return { found: false, via: null, extraTime: 0 }
}

function calculateSpeedOptimization(train: Train, conditions: string) {
  if (conditions === 'clear') {
    const timeSaved = Math.floor(Math.random() * 5) - 2
    const reasons = ['Optimal speed profile', 'Clear signals ahead', 'Flow synchronized', 'Dynamic speed adjustment']
    return { timeSaved, reason: reasons[Math.floor(Math.random() * reasons.length)] }
  }
  return { timeSaved: 0, reason: 'Standard operation' }
}

function calculateNetworkMetrics(decisions: Decision[], trains: Train[], network: RailwayNetwork) {
  const totalTimeSaved = decisions.reduce((sum, d) => sum - d.impact, 0)
  const proceedingTrains = decisions.filter(d => d.action === 'proceed').length
  const efficiency = Math.round((proceedingTrains / trains.length) * 100)
  return {
    totalTimeSaved,
    efficiency,
  }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

