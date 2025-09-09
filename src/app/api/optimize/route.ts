import { NextRequest, NextResponse } from "next/server"
import { optimizeSchedule } from "@/lib/optimizer/mip"
import { heuristicSchedule } from "@/lib/optimizer/heuristics"
import { validateInput } from "@/lib/utils"
import { RailwayNetwork, Train } from "@/lib/types"

// This API route is the gateway to our AI.
// It now returns a richer payload including both the decisions and the reasoning log.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { network, trains, options }: { network: RailwayNetwork, trains: Train[], options?: { strategy: string } } = body

    const validationError = validateInput(network, trains)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const useMIP = options?.strategy !== 'heuristic'

    // We now expect a different return structure from our optimizers.
    const results = useMIP
      ? await optimizeSchedule(network, trains)
      : heuristicSchedule(network, trains)

    // The response is now more intelligent, returning the log alongside the decisions.
    return NextResponse.json({
      status: "success",
      strategy: useMIP ? "mip" : "heuristic",
      decisions: results.decisions,
      log: results.log,
    })

  } catch (error) {
    console.error("Optimizer Core Breach:", error)
    return NextResponse.json(
      { error: "Internal solver failure. Tactical reassessment required." },
      { status: 500 }
    )
  }
}

