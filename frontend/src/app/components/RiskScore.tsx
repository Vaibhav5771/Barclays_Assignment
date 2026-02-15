interface RiskScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RiskScore({ score, size = 'md', showLabel = true }: RiskScoreProps) {
  const getColor = (score: number) => {
    if (score >= 0.7) return '#DC2626'; // red-600
    if (score >= 0.4) return '#F59E0B'; // amber-500
    return '#3B82F6'; // blue-500
  };

  const getBgColor = (score: number) => {
    if (score >= 0.7) return '#FEE2E2'; // red-100
    if (score >= 0.4) return '#FEF3C7'; // amber-100
    return '#DBEAFE'; // blue-100
  };

  const sizes = {
    sm: { container: 60, stroke: 6, fontSize: 'text-sm' },
    md: { container: 100, stroke: 8, fontSize: 'text-2xl' },
    lg: { container: 140, stroke: 10, fontSize: 'text-4xl' }
  };

  const { container, stroke } = sizes[size];
  const radius = (container - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score * circumference);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: container, height: container }}>
        <svg width={container} height={container} className="rotate-[-90deg]">
          <circle
            cx={container / 2}
            cy={container / 2}
            r={radius}
            fill={getBgColor(score)}
            stroke="#E5E7EB"
            strokeWidth={stroke}
          />
          <circle
            cx={container / 2}
            cy={container / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${sizes[size].fontSize} font-semibold`} style={{ color: getColor(score) }}>
          {score.toFixed(2)}
        </div>
      </div>
      {showLabel && <span className="text-sm text-slate-600">Risk Score</span>}
    </div>
  );
}
