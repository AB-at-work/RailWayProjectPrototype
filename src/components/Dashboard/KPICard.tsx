// components/Dashboard/KPICard.tsx
interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  description?: string;
}

export default function KPICard({ title, value, unit, trend, description }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {value}
          {unit && <span className="text-sm font-medium text-gray-600 ml-1">{unit}</span>}
        </p>
        {trend !== undefined && (
          <span className={`ml-2 text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}