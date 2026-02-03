import { useState } from 'react';

interface Props {
  total: number;
  visited: number;
  notVisited: number;
  unreviewed: number;
  size?: number;
}

export default function ProgressRing({ total, visited, notVisited, unreviewed, size = 140 }: Props) {
  const [hovered, setHovered] = useState<'visited' | 'notVisited' | 'unreviewed' | null>(null);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages and lengths for each segment
  const visitedPct = total > 0 ? visited / total : 0;
  const notVisitedPct = total > 0 ? notVisited / total : 0;
  const unreviewedPct = total > 0 ? unreviewed / total : 0;

  const visitedLength = visitedPct * circumference;
  const notVisitedLength = notVisitedPct * circumference;
  const unreviewedLength = unreviewedPct * circumference;

  // Offsets: each segment starts where the previous one ended
  const visitedOffset = 0;
  const notVisitedOffset = visitedLength;
  const unreviewedOffset = visitedLength + notVisitedLength;

  const getTooltipContent = () => {
    if (hovered === 'visited') return { count: visited, label: 'Visited', color: 'text-green-600' };
    if (hovered === 'notVisited') return { count: notVisited, label: 'Not Visited', color: 'text-red-500' };
    if (hovered === 'unreviewed') return { count: unreviewed, label: 'Unreviewed', color: 'text-gray-500' };
    return null;
  };

  const tooltip = getTooltipContent();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {/* Unreviewed segment (gray) */}
        {unreviewedPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={hovered === 'unreviewed' ? '#9ca3af' : '#d1d5db'}
            strokeWidth={hovered === 'unreviewed' ? strokeWidth + 2 : strokeWidth}
            strokeDasharray={`${unreviewedLength} ${circumference - unreviewedLength}`}
            strokeDashoffset={-unreviewedOffset}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHovered('unreviewed')}
            onMouseLeave={() => setHovered(null)}
          />
        )}
        {/* Not visited segment (red) */}
        {notVisitedPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={hovered === 'notVisited' ? '#ef4444' : '#f87171'}
            strokeWidth={hovered === 'notVisited' ? strokeWidth + 2 : strokeWidth}
            strokeDasharray={`${notVisitedLength} ${circumference - notVisitedLength}`}
            strokeDashoffset={-notVisitedOffset}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHovered('notVisited')}
            onMouseLeave={() => setHovered(null)}
          />
        )}
        {/* Visited segment (green) */}
        {visitedPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={hovered === 'visited' ? '#16a34a' : '#22c55e'}
            strokeWidth={hovered === 'visited' ? strokeWidth + 2 : strokeWidth}
            strokeDasharray={`${visitedLength} ${circumference - visitedLength}`}
            strokeDashoffset={-visitedOffset}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHovered('visited')}
            onMouseLeave={() => setHovered(null)}
          />
        )}
      </svg>
      <div className="absolute text-center">
        {tooltip ? (
          <>
            <span className={`text-3xl font-bold ${tooltip.color}`}>{tooltip.count}</span>
            <br />
            <span className="text-xs text-gray-400">{tooltip.label}</span>
          </>
        ) : (
          <>
            <span className="text-3xl font-bold text-gray-900">{total}</span>
            <br />
            <span className="text-xs text-gray-400">businesses</span>
          </>
        )}
      </div>
    </div>
  );
}
