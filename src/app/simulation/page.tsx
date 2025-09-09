"use client";

import { useState } from "react";
import { runSimulation } from "@/lib/simulation/simulator";
import network from "@/lib/data/network.json";
import trains from "@/lib/data/trains.json";
import { Schedule } from "@/lib/types";

export default function SimulationPage() {
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Convert trains.json into a Schedule object
  const buildSchedule = (): Schedule => {
    const schedule: Schedule = {};
    trains.trains.forEach((train: any) => {
      schedule[train.id] = train.route.map((stop: any) => ({
        node: stop.node,
        arrival: stop.arrival,
      }));
    });
    return schedule;
  };

  const handleRunSimulation = () => {
    setLoading(true);
    try {
      const schedule = buildSchedule();
      // Ensure node.type matches the RailwayNetwork Node type union
      const mappedNetwork = {
        ...network,
        nodes: network.nodes.map((node: any) => ({
          ...node,
          type: node.type as "station" | "junction" | "terminal" | "yard" | "crossing"
        })),
        edges: network.edges.map((edge: any) => ({
          ...edge,
          status: edge.status === "open" ? "open" : "closed"
        }))
      };
      const simResults = runSimulation(mappedNetwork, schedule, { randomEvents: true });
      setResults(simResults);
    } catch (err) {
      console.error("Simulation error:", err);
      alert("Simulation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Run Simulation</h1>

      <button
        onClick={handleRunSimulation}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Simulation"}
      </button>

      {results && (
        <div className="mt-6 space-y-6">
          {/* Metrics */}
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Simulation Metrics</h2>
            <ul className="list-disc list-inside">
              <li>Total Trains: {results.metrics.totalTrains}</li>
              <li>On-Time Performance: {results.metrics.onTimePerformance.toFixed(2)}%</li>
              <li>Average Delay: {results.metrics.averageDelay.toFixed(2)} mins</li>
              <li>Max Delay: {results.metrics.maxDelay} mins</li>
              <li>Resource Utilization: {results.metrics.resourceUtilization.toFixed(2)}%</li>
              <li>Conflicts: {results.metrics.conflicts}</li>
            </ul>
          </div>

          {/* Timeline */}
          <div className="p-4 bg-gray-100 rounded-lg shadow max-h-[400px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Timeline of Events</h2>
            {results.timeline.length === 0 ? (
              <p>No events recorded.</p>
            ) : (
              <ul className="space-y-2">
                {results.timeline.map((event: any, idx: number) => (
                  <li
                    key={idx}
                    className={`p-2 rounded border ${
                      event.status === "conflict"
                        ? "border-red-500 bg-red-50"
                        : event.status === "delayed"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-green-500 bg-green-50"
                    }`}
                  >
                    <strong>Train {event.trainId}</strong> at {event.location} →{" "}
                    {event.status.toUpperCase()} (Delay: {event.details.delay} mins)
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Warnings */}
          {results.warnings && results.warnings.length > 0 && (
            <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
              <h2 className="font-semibold">Warnings</h2>
              <ul className="list-disc list-inside">
                {results.warnings.map((w: string, idx: number) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
