// components/DecisionPanel/DecisionTable.tsx
interface Decision {
  id: string;
  trainId: string;
  action: 'hold' | 'proceed' | 'reroute' | 'merge';
  reason: string;
  impact: number;
  confidence: number;
}

export default function DecisionTable() {
  const decisions: Decision[] = [
    { id: '1', trainId: 'T-234', action: 'hold', reason: 'Conflict at Junction B', impact: -2, confidence: 92 },
    { id: '2', trainId: 'T-567', action: 'proceed', reason: 'Clear path to destination', impact: 0, confidence: 98 },
    { id: '3', trainId: 'T-891', action: 'reroute', reason: 'Track maintenance on primary route', impact: 5, confidence: 85 }
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'hold': return 'bg-yellow-100 text-yellow-800';
      case 'proceed': return 'bg-green-100 text-green-800';
      case 'reroute': return 'bg-blue-100 text-blue-800';
      case 'merge': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Train</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Impact (min)</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {decisions.map((decision) => (
              <tr key={decision.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{decision.trainId}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getActionColor(decision.action)}`}>
                    {decision.action}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{decision.impact}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{decision.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}