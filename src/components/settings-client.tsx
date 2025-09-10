"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { Badge } from "@/components/UI/badge"
import { Button } from "@/components/UI/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select"
import { Settings, Brain, Zap, Shield, Database, Bell, Palette, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { useSettings } from "@/context/SettingsContext"

export default function SettingsClient() {
  const { theme, setTheme } = useTheme()
  const {
    optimizationEngine,
    setOptimizationEngine,
    refreshInterval,
    setRefreshInterval,
    alertLevel,
    setAlertLevel,
    apiMode,
    setApiMode,
    mapStyle,
    setMapStyle,
    dashboardLayout,
    setDashboardLayout,
    animationSpeed,
    setAnimationSpeed,
  } = useSettings()

  const systemStatus = {
    optimizerStatus: "Active",
    simulatorStatus: "Standby",
    databaseStatus: "Connected",
    apiStatus: "Healthy",
    lastBackup: "2 hours ago",
    uptime: "99.97%"
  }

  return (
    <div className="h-screen overflow-y-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">System Command</h1>
        <p className="text-muted-foreground">Master control over the RailAI universe</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="xl:col-span-2 space-y-6">
          {/* AI Engine Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Engine Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Optimization Engine</label>
                  <Select value={optimizationEngine} onValueChange={setOptimizationEngine}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mip">Mixed Integer Programming</SelectItem>
                      <SelectItem value="heuristic">Heuristic Algorithm</SelectItem>
                      <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                      <SelectItem value="ml">Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Apply AI Configuration</Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Performance & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Data Refresh Interval</label>
                  <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Alert Sensitivity</label>
                  <Select value={alertLevel} onValueChange={setAlertLevel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="text-sm font-medium mb-2 block">API Mode</label>
              <Select value={apiMode} onValueChange={setApiMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Interface Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Interface Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme</label>
                  <Select value={theme} onValueChange={(val) => setTheme(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Dashboard Layout</label>
                  <Select value={dashboardLayout} onValueChange={setDashboardLayout}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Map Style</label>
                  <Select value={mapStyle} onValueChange={setMapStyle}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Animation Speed</label>
                  <Select value={animationSpeed} onValueChange={setAnimationSpeed}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar remains same */}
        {/* ... keep your sidebar code exactly as it is ... */}
      </div>
    </div>
  )
}
