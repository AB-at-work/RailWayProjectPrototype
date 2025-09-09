import { loadNetworkData, loadTrainData } from "@/lib/data-loader"
import DashboardClient from "@/components/dashboard-client"

// This is the true form of our main page. A lean, powerful Server Component.
// Its sole purpose is to fetch data on the server and pass it to the interactive client.
export default async function Home() {
  const network = await loadNetworkData()
  const trains = await loadTrainData()

  // It renders the client-side brain of our application, providing it with the initial state of the world.
  return (
    <DashboardClient
      initialNetwork={network}
      initialTrains={trains}
    />
  )
}

