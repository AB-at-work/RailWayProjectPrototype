import { NextRequest, NextResponse } from 'next/server';
import { optimizeSchedule } from '@/lib/optimizer/mip';
import { heuristicSchedule } from '@/lib/optimizer/heuristics';
import { validateInput } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { network, trains, options } = body;

    const validationError = validateInput(network, trains);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const useMIP = options?.strategy === 'optimal' || true; // Default to MIP for now
    const results = useMIP
      ? await optimizeSchedule(network, trains)
      : heuristicSchedule(network, trains);

    // The API now returns the schedule, metrics, AND the reasoning log.
    return NextResponse.json({
      status: 'success',
      strategy: useMIP ? 'mip' : 'heuristic',
      schedule: results.schedule,
      metrics: results.metrics,
      log: results.log,
    });

  } catch (error) {
    console.error('Optimizer Core Breach:', error);
    return NextResponse.json(
      { error: 'Internal solver failure. Tactical reassessment required.' },
      { status: 500 }
    );
  }
}

