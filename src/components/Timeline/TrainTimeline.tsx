// components/Timeline/TrainTimeline.tsx
interface TimelineEvent {
  id: string;
  trainId: string;
  station: string;
  scheduledArrival: string;
  actualArrival: string;
  status: 'on-time' | 'delayed' | 'early';
}

export default function TrainTimeline() {
  const events: TimelineEvent[] = [
    { id: '1', trainId: 'T-234', station: 'Central Station', scheduledArrival: '14:30', actualArrival: '14:32', status: 'delayed' },
    { id: '2', trainId: 'T-567', station: 'North Junction', scheduledArrival: '14:45', actualArrival: '14:43', status: 'early' },
    { id: '3', trainId: 'T-891', station: 'East Terminal', scheduledArrival: '15:00', actualArrival: '15:00', status: 'on-time' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'early': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Train Timeline</h2>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {events.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                      <span className="text-white text-sm font-bold">T</span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">
                        Train {event.trainId} at {event.station}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(event.status)}">
                        {event.status}
                      </span>
                      <div className="text-xs text-gray-400">
                        Scheduled: {event.scheduledArrival}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}