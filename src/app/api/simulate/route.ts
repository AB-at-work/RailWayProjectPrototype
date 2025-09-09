// app/api/simulate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runSimulation } from '@/lib/simulation/simulator';
// This import path is now corrected to the new source of truth.
import { validateInput } from '@/lib/utils';
import { RailwayNetwork, Schedule } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { network, schedule, options }: { network: RailwayNetwork; schedule: Schedule; options: any } = body;

    if (!network || !schedule) {
      return NextResponse.json(
        { error: 'Network and schedule data required' },
        { status: 400 }
      );
    }

    // Although the original file didn't validate here, a flawless system leaves nothing to chance.
    // We will add validation for consistency. The original `trains` object is analogous to `schedule`.
    // We'll create a temporary train array from the schedule keys for validation.
    const trainsForValidation = Object.keys(schedule).map(id => ({ id, route: [], schedule: [] })); // Simplified for validation
    const validationError = validateInput(network, trainsForValidation as any);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const simulationResults = runSimulation(network, schedule, options);

    return NextResponse.json({
      status: 'success',
      simulation: simulationResults
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error('Simulation Engine Failure:', errorMessage);
    return NextResponse.json(
      { error: 'Simulation runtime exception. Check system parameters.', details: errorMessage },
      { status: 500 }
    );
  }
}
