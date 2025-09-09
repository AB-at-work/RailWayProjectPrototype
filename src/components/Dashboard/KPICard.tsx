import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend?: number
  description?: string
  Icon?: LucideIcon // The Icon is now a part of the component's props
}

export default function KPICard({ title, value, unit, trend, Icon }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground">
            <span className={trend >= 0 ? 'text-green-500' : 'text-destructive'}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            {' '}from last period
          </p>
        )}
      </CardContent>
    </Card>
  )
}

