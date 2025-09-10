import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import Sidebar from '@/components/Layout/Sidebar'
import { SettingsProvider } from "@/context/SettingsContext"


const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'RailAI: Intelligent Network Optimizer',
  description: 'A legendary tool for real-time railway network optimization and simulation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
                {children}
              </main>
            </div>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}