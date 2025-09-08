// app/api/simulate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runSimulation } from '@/lib/simulation/simulator';
import { validateInput } from '@/utils/helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { network, schedule, options } = body;

    if (!network || !schedule) {
      return NextResponse.json(
        { error: 'Network and schedule data required' },
        { status: 400 }
      );
    }

    const simulationResults = runSimulation(network, schedule, options);

    return NextResponse.json({
      status: 'success',
      simulation: simulationResults
    });

  } catch (error) {
    console.error('Simulation Engine Failure:', error);
    return NextResponse.json(
      { error: 'Simulation runtime exception. Check system parameters.' },
      { status: 500 }
    );
  }
}