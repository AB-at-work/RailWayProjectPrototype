import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card"
import { Train } from "@/lib/types"
import { cn } from "@/lib/utils"
import { TrainTrack } from "lucide-react"

interface TrainTimelineProps {
  trains: Train[]
}

// We flatten the schedule of all trains into a single, sorted timeline of events.
// This is a more robust, data-driven approach than the old hardcoded list.
type TimelineEvent = {
  trainId: string
  node: string
  time: string
  type: 'arrival' | 'departure'
}

export default function TrainTimeline({ trains }: TrainTimelineProps) {
  const allEvents = trains
    .flatMap((train) =>
      train.schedule.flatMap((stop) => [
        { trainId: train.id, node: stop.node, time: stop.arrival, type: 'arrival' as const },
        { trainId: train.id, node: stop.node, time: stop.departure, type: 'departure' as const },
      ])
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 10); // Limit to the latest 10 events for a clean UI

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Event Log</CardTitle>
        <CardDescription>
          A real-time feed of train arrivals and departures across the network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {allEvents.map((event, index) => (
            <div key={index} className="relative flex items-start">
              {/* Timeline Line */}
              <div className="absolute left-4 top-5 h-full w-0.5 bg-border" />

              {/* Icon */}
              <div className={cn(
                  "z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-background",
                  event.type === 'arrival' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
              )}>
                <TrainTrack className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="ml-4 flex-grow">
                <p className="font-semibold text-foreground">
                  Train {event.trainId}{" "}
                  <span className={cn(
                    "font-normal",
                     event.type === 'arrival' ? "text-green-400" : "text-red-400"
                  )}>
                    {event.type === 'arrival' ? 'arrived at' : 'departed from'}
                  </span>{" "}
                  {event.node}
                </p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

