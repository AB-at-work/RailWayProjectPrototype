// components/DecisionPanel/Explanation.tsx
export default function Explanation() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Optimization Rationale</h2>
      <div className="prose prose-sm max-w-none">
        <p>The current schedule optimization prioritizes minimizing total network delay while maintaining safety margins.</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Train T-234 is held for 2 minutes to resolve a potential conflict at Junction B</li>
          <li>Train T-891 is rerouted via the northern corridor adding 5 minutes but avoiding maintenance delays</li>
          <li>Throughput is maximized by reducing headway between non-conflicting trains</li>
        </ul>
        <p className="mt-2">This configuration improves overall network efficiency by 12% compared to the baseline schedule.</p>
      </div>
    </div>
  );
}