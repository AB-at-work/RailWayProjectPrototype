import { loadNetworkData, loadTrainData } from "@/lib/data-loader"
import AnalyticsClient from "@/components/analytics-client"

export default async function AnalyticsPage() {
  const network = await loadNetworkData()
  const trains = await loadTrainData()

  return (
    <AnalyticsClient
      initialNetwork={network}
      initialTrains={trains}
    />
  )
}