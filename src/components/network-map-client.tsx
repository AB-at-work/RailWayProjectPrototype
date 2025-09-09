"use client"

import { useState, useEffect } from "react"
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { Badge } from "@/components/UI/badge"
import { Button } from "@/components/UI/button"
import { RailwayNetwork, Train, Edge } from "@/lib/types"
import { MapPin, Zap, AlertTriangle, Activity, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface NetworkMapClientProps {
  initialNetwork: RailwayNetwork
  initialTrains: Train[]
}

export default function NetworkMapClient({ initialNetwork, initialTrains }: NetworkMapClientProps) {
  const [network, setNetwork] = useState<RailwayNetwork>(initialNetwork)
  const [trains, setTrains] = useState<Train[]>(initialTrains)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [liveMode, setLiveMode] = useState(true)

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  // Calculate network center
  const latitudes = network.nodes.map(node => node.lat).filter((lat): lat is number => typeof lat === "number")
  const longitudes = network.nodes.map(node => node.lon).filter((lon): lon is number => typeof lon === "number")
  const centerLat = latitudes.length > 0 ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length : 28.6139
  const centerLon = longitudes.length > 0 ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length : 77.2090

  // Generate track lines GeoJSON
  const trackLinesGeoJSON = {
    type: "FeatureCollection",
    features: network.edges.map(edge => {
      const fromNode = network.nodes.find(n => n.id === edge.from)
      const toNode = network.nodes.find(n => n.id === edge.to)

      if (!fromNode || !toNode) return null

      return {
        type: "Feature",
        properties: {
          id: edge.id,
          status: edge.status,
          capacity: edge.capacity,
          maxSpeed: edge.maxSpeed
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [fromNode.lon, fromNode.lat],
            [toNode.lon, toNode.lat]
          ]
        }
      }
    }).filter(Boolean)
  }

  const getNodeColor = (node: any) => {
    const trainsAtNode = trains.filter(train =>
      train.route.includes(node.id) ||
      train.schedule.some(stop => stop.node === node.id)
    ).length

    if (trainsAtNode >= node.capacity) return "rgb(239, 68, 68)" // red-500
    if (trainsAtNode > 0) return "rgb(34, 197, 94)" // green-500
    return "rgb(59, 130, 246)" // blue-500
  }

  const selectedNodeData = selectedNode ? network.nodes.find(n => n.id === selectedNode) : null

  if (!mapboxToken) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Mapbox Access Token is not configured.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 relative">
        <Map
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            longitude: centerLon,
            latitude: centerLat,
            zoom: 10,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
        >
          <NavigationControl position="top-right" />

          {/* Track Lines */}
          <Source id="tracks" type="geojson" data={trackLinesGeoJSON}>
            <Layer
              id="tracks-layer"
              type="line"
              paint={{
                'line-color': [
                  'case',
                  ['==', ['get', 'status'], 'closed'],
                  'rgb(239, 68, 68)', // red for closed
                  'rgb(34, 197, 94)'  // green for open
                ],
                'line-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  8, 2,
                  12, 4
                ],
                'line-opacity': 0.8
              }}
            />
          </Source>

          {/* Station Markers */}
          {network.nodes.map((node) => (
            <Marker
              key={node.id}
              longitude={node.lon as number}
              latitude={node.lat as number}
              onClick={() => setSelectedNode(node.id)}
            >
              <div className="relative cursor-pointer">
                <MapPin
                  className="h-8 w-8 drop-shadow-lg"
                  style={{ color: getNodeColor(node) }}
                />
                <div className="absolute -top-2 -right-2 bg-background border rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {trains.filter(t => t.route.includes(node.id)).length}
                </div>
              </div>
            </Marker>
          ))}
        </Map>

        {/* Live Mode Toggle */}
        <div className="absolute top-4 left-4">
          <Button
            variant={liveMode ? "default" : "outline"}
            onClick={() => setLiveMode(!liveMode)}
            className="backdrop-blur-sm bg-background/80"
          >
            <Activity className={cn("mr-2 h-4 w-4", liveMode && "animate-pulse")} />
            {liveMode ? "Live Mode" : "Static"}
          </Button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 border-l bg-background p-4 space-y-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Nodes</span>
              <Badge variant="proceed">{network.nodes.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Open Tracks</span>
              <Badge variant="proceed">
                {network.edges.filter(e => e.status === 'open').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Closed Tracks</span>
              <Badge variant="destructive">
                {network.edges.filter(e => e.status === 'closed').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Trains</span>
              <Badge variant="outline">{trains.length}</Badge>
            </div>
          </CardContent>
        </Card>

        {selectedNodeData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {selectedNodeData.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">{selectedNodeData.type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="text-sm font-semibold">{selectedNodeData.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trains Here</span>
                <span className="text-sm font-semibold">
                  {trains.filter(t => t.route.includes(selectedNodeData.id)).length}
                </span>
              </div>
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Connected Tracks</h4>
                <div className="space-y-1">
                  {network.edges
                    .filter(e => e.from === selectedNodeData.id || e.to === selectedNodeData.id)
                    .map(edge => (
                      <div key={edge.id} className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{edge.id}</span>
                        <Badge variant={edge.status === 'open' ? 'proceed' : 'destructive'}>
                          {edge.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedNode(null)}
              >
                Close Details
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {network.edges.filter(e => e.status === 'closed').length > 0 ? (
              <div className="space-y-2">
                {network.edges
                  .filter(e => e.status === 'closed')
                  .map(edge => (
                    <div key={edge.id} className="text-sm p-2 bg-destructive/10 rounded border-l-2 border-destructive">
                      Track {edge.id} is closed
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active alerts</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}