"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type ThemeMode = "light" | "dark" | "system"

interface SettingsContextType {
  optimizationEngine: string
  refreshInterval: string
  alertLevel: string
  apiMode: string
  mapStyle: string
  dashboardLayout: string
  animationSpeed: string
  setOptimizationEngine: (val: string) => void
  setRefreshInterval: (val: string) => void
  setAlertLevel: (val: string) => void
  setApiMode: (val: string) => void
  setMapStyle: (val: string) => void
  setDashboardLayout: (val: string) => void
  setAnimationSpeed: (val: string) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [optimizationEngine, setOptimizationEngine] = useState("mip")
  const [refreshInterval, setRefreshInterval] = useState("30")
  const [alertLevel, setAlertLevel] = useState("medium")
  const [apiMode, setApiMode] = useState("production")
  const [mapStyle, setMapStyle] = useState("dark")
  const [dashboardLayout, setDashboardLayout] = useState("standard")
  const [animationSpeed, setAnimationSpeed] = useState("normal")

  return (
    <SettingsContext.Provider
      value={{
        optimizationEngine,
        refreshInterval,
        alertLevel,
        apiMode,
        mapStyle,
        dashboardLayout,
        animationSpeed,
        setOptimizationEngine,
        setRefreshInterval,
        setAlertLevel,
        setApiMode,
        setMapStyle,
        setDashboardLayout,
        setAnimationSpeed,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error("useSettings must be used within SettingsProvider")
  return context
}
