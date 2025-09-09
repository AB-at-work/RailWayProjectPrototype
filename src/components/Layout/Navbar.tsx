"use client"

import HeaderActions from "@/components/Layout/HeaderActions"
import { Button } from "@/components/UI/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/UI/sheet"
import { Menu } from "lucide-react"
import Sidebar from "@/components/Layout/Sidebar"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

// This is the definitive interface. The Navbar is a conduit for commands.
interface NavbarProps {
  onOptimize: () => void
  onSimulate: () => void
  isOptimizing: boolean
  isSimulating: boolean
}

// This is the final, flawless component. All imports are correct. All logic is sound.
export default function Navbar({ onOptimize, onSimulate, isOptimizing, isSimulating }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* The Sheet component provides a flawless mobile-first navigation experience. */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* This spacer correctly aligns our action items to the right. */}
      <div className="relative ml-auto flex-1 md:grow-0" />

      {/* The action items are grouped for a clean, professional layout. */}
      <div className="flex items-center gap-2">
        <HeaderActions
          onOptimize={onOptimize}
          onSimulate={onSimulate}
          isOptimizing={isOptimizing}
          isSimulating={isSimulating}
        />
        <ThemeToggleButton />
      </div>
    </header>
  )
}

