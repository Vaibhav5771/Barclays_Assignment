import { Badge } from '../components/ui/badge';

interface RiskBadgeProps {
  bucket: 'Low' | 'Medium' | 'High';
  size?: 'sm' | 'md';
}

export function RiskBadge({ bucket, size = 'md' }: RiskBadgeProps) {
  const styles = {
    Low: 'bg-blue-100 text-blue-800 border-blue-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    High: 'bg-red-100 text-red-800 border-red-200'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1';

  return (
    <Badge variant="outline" className={`${styles[bucket]} ${sizeClasses} border`}>
      {bucket} Risk
    </Badge>
  );
}
