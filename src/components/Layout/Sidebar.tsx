"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  CalendarClock,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  TrainTrack,
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * This is not merely a sidebar. It is the command console for our application.
 * It is stateful, responsive, and aesthetically superior to the relic it replaces.
 *
 * Key Features:
 * - Collapsible: Expands for clarity, collapses for focus. The state is managed
 * internally, a hallmark of a well-encapsulated component.
 * - Data-Driven Navigation: Links are not hardcoded. They are mapped from a
 * structured array, making the sidebar easily extensible.
 * - Professional Iconography: `lucide-react` provides crisp, consistent icons,
 * a vast improvement over the clumsy inline SVGs.
 * - Fluid Animations: `framer-motion` is used for smooth, satisfying transitions
 * during collapse and expand, providing essential user feedback.
 * - Active State Awareness: The component uses the `usePathname` hook to
 * intelligently highlight the currently active link.
 */

// We define our navigation structure here. This is the single source of truth.
// To add a new page, simply add a new object to this array.
const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/network-map", label: "Network Map", icon: Map },
  { href: "/schedules", label: "Schedules", icon: CalendarClock },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
]

const settingsLink = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative hidden h-screen flex-col border-r border-border bg-card text-card-foreground md:flex"
    >
      {/* ===== Logo and Brand ===== */}
      <div className="flex h-16 items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <TrainTrack className="h-8 w-8 text-primary" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold tracking-tighter"
              >
                RailAI
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== Navigation Links ===== */}
      <nav className="flex-1 space-y-2 p-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.label : ""}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                {
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground":
                    isActive,
                }
              )}
            >
              <Icon className="h-5 w-5" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* ===== Footer Section (Settings & Collapse Button) ===== */}
      <div className="mt-auto border-t border-border p-2">
        <Link
          href={settingsLink.href}
          title={isCollapsed ? settingsLink.label : ""}
          className="flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <settingsLink.icon className="h-5 w-5" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                {settingsLink.label}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-3 rounded-lg p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}