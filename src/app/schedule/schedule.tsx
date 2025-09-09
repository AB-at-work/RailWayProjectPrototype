import { loadNetworkData, loadTrainData } from "@/lib/data-loader"
import SchedulesClient from "@/components/schedules-client"

export default async function SchedulesPage() {
  const network = await loadNetworkData()
  const trains = await loadTrainData()

  return (
    <SchedulesClient
      initialNetwork={network}
      initialTrains={trains}
    />
  )
}