// app/page.tsx
import MetricsPanel from '@/components/Dashboard/MetricsPanel';
import TrackMap from '@/components/Map/TrackMap';
import TrainTimeline from '@/components/Timeline/TrainTimeline';
import DecisionTable from '@/components/DecisionPanel/DecisionTable';
import Explanation from '@/components/DecisionPanel/Explanation';

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-8 space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <TrackMap />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <TrainTimeline />
        </div>
      </div>
      <div className="col-span-4 space-y-4">
        <MetricsPanel />
        <div className="bg-white rounded-lg shadow p-4">
          <DecisionTable />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <Explanation />
        </div>
      </div>
    </div>
  );
}