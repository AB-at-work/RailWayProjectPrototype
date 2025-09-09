"use client"

import Map, { Marker, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { RailwayNetwork } from "@/lib/types"
import { Pin } from "lucide-react"

interface TrackMapProps {
  network: RailwayNetwork
}

// A god-tier map requires a default export for clean, unambiguous imports.
// The previous version's named export was a structural flaw. It has been corrected.
export default function TrackMap({ network }: TrackMapProps) {
  // A map without a token is a blank canvas. This is a critical error to be fixed by the user.
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <p>Mapbox Access Token is not configured.</p>
      </div>
    )
  }

  // We find the center of our network to focus the map.
  // This is a simple but effective way to ensure the map is always relevant.
  const latitudes = network.nodes.map(node => node.lat).filter((lat): lat is number => typeof lat === "number")
  const longitudes = network.nodes.map(node => node.lon).filter((lon): lon is number => typeof lon === "number")
  const centerLat = latitudes.length > 0 ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length : 0
  const centerLon = longitudes.length > 0 ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length : 0

  return (
    <Map
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        longitude: centerLon || -74.006,
        latitude: centerLat || 40.7128,
        zoom: 11,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      <NavigationControl position="top-right" />
      {network.nodes
        .filter(node => typeof node.lat === "number" && typeof node.lon === "number")
        .map((node) => (
          <Marker key={node.id} longitude={node.lon as number} latitude={node.lat as number}>
            <Pin className="h-6 w-6 fill-primary text-primary-foreground" />
          </Marker>
        ))}
    </Map>
  )
}

