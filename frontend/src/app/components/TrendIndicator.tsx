import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  trend: 'improving' | 'stable' | 'worsening';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function TrendIndicator({ trend, showLabel = false, size = 'md' }: TrendIndicatorProps) {
  const config = {
    improving: {
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Improving'
    },
    stable: {
      icon: Minus,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      label: 'Stable'
    },
    worsening: {
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Worsening'
    }
  };

  const { icon: Icon, color, bgColor, label } = config[trend];
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <div className={`inline-flex items-center gap-1.5 ${bgColor} ${color} rounded-full px-2.5 py-1`}>
      <Icon size={iconSize} />
      {showLabel && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
