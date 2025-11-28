import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const VitalCard = ({
  label,
  value,
  unit,
  status,
  icon: Icon,
  trend
}) => {
  const statusColors = {
    normal: 'border-emerald-200 bg-emerald-50',
    high: 'border-red-200 bg-red-50',
    low: 'border-amber-200 bg-amber-50'
  };

  const statusTextColors = {
    normal: 'text-emerald-700',
    high: 'text-red-700',
    low: 'text-amber-700'
  };

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus
  };

  const TrendIcon = trendIcons[trend];

  return (
    <div className={`rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className={`h-6 w-6 ${statusTextColors[status]}`} />
        <TrendIcon className={`h-4 w-4 ${statusTextColors[status]}`} />
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        <p className={`text-xs font-medium capitalize ${statusTextColors[status]}`}>
          {status}
        </p>
      </div>
    </div>
  );
};