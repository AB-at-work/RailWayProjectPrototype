import { loadNetworkData, loadTrainData } from "@/lib/data-loader"
import NetworkMapClient from "@/components/network-map-client"

export default async function NetworkMapPage() {
  const network = await loadNetworkData()
  const trains = await loadTrainData()

  return (
    <NetworkMapClient
      initialNetwork={network}
      initialTrains={trains}
    />
  )
}