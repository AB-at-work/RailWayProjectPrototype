// app/api/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { optimizeSchedule } from '@/lib/optimizer/mip';
import { heuristicSchedule } from '@/lib/optimizer/heuristics';
// This import path is now corrected to the new source of truth.
import { validateInput } from '@/lib/utils';
import { RailwayNetwork, Train } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { network, trains, options }: { network: RailwayNetwork; trains: Train[]; options: { strategy: string } } = body;

    const validationError = validateInput(network, trains);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const useMIP = options?.strategy === 'optimal';
    const results = useMIP
      ? await optimizeSchedule(network, trains)
      : heuristicSchedule(network, trains);

    return NextResponse.json({
      status: 'success',
      strategy: useMIP ? 'mip' : 'heuristic',
      schedule: results.schedule,
      metrics: results.metrics,
      log: results.log
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error('Optimizer Core Breach:', errorMessage);
    return NextResponse.json(
      { error: 'Internal solver failure. Tactical reassessment required.', details: errorMessage },
      { status: 500 }
    );
  }
}

