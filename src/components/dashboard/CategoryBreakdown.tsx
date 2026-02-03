import { useState } from 'react';
import type { CategoryStat } from '@/hooks/useDashboardStats';

interface Props {
  categories: CategoryStat[];
}

function CategoryRow({ cat }: { cat: CategoryStat }) {
  const [hovered, setHovered] = useState<'visited' | 'notVisited' | 'unreviewed' | null>(null);

  const visitedPct = cat.total > 0 ? (cat.visited / cat.total) * 100 : 0;
  const notVisitedPct = cat.total > 0 ? (cat.notVisited / cat.total) * 100 : 0;
  const unreviewedPct = cat.total > 0 ? (cat.unreviewed / cat.total) * 100 : 0;

  const getDisplayText = () => {
    if (hovered === 'visited') {
      return <><span className="text-green-600 font-medium">{cat.visited}</span> visited</>;
    }
    if (hovered === 'notVisited') {
      return <><span className="text-red-500 font-medium">{cat.notVisited}</span> not visited</>;
    }
    if (hovered === 'unreviewed') {
      return <><span className="text-gray-500 font-medium">{cat.unreviewed}</span> unreviewed</>;
    }
    const pct = cat.total > 0 ? Math.round((cat.visited / cat.total) * 100) : 0;
    return <><span className="text-green-600 font-medium">{pct}%</span> visited of {cat.total}</>;
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">{cat.category}</span>
        <span className="text-gray-400 transition-all duration-200">
          {getDisplayText()}
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
        {visitedPct > 0 && (
          <div
            className={`h-full transition-all duration-300 cursor-pointer ${
              hovered === 'visited' ? 'bg-green-600' : 'bg-green-500'
            }`}
            style={{
              width: `${visitedPct}%`,
              transform: hovered === 'visited' ? 'scaleY(1.5)' : 'scaleY(1)',
            }}
            onMouseEnter={() => setHovered('visited')}
            onMouseLeave={() => setHovered(null)}
          />
        )}
        {notVisitedPct > 0 && (
          <div
            className={`h-full transition-all duration-300 cursor-pointer ${
              hovered === 'notVisited' ? 'bg-red-500' : 'bg-red-400'
            }`}
            style={{
              width: `${notVisitedPct}%`,
              transform: hovered === 'notVisited' ? 'scaleY(1.5)' : 'scaleY(1)',
            }}
            onMouseEnter={() => setHovered('notVisited')}
            onMouseLeave={() => setHovered(null)}
          />
        )}
        {unreviewedPct > 0 && (
          <div
            className={`h-full transition-all duration-300 cursor-pointer ${
              hovered === 'unreviewed' ? 'bg-gray-400' : 'bg-gray-300'
            }`}
            style={{
              width: `${unreviewedPct}%`,
              transform: hovered === 'unreviewed' ? 'scaleY(1.5)' : 'scaleY(1)',
            }}
            onMouseEnter={() => setHovered('unreviewed')}
            onMouseLeave={() => setHovered(null)}
          />
        )}
      </div>
    </div>
  );
}

export default function CategoryBreakdown({ categories }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">By Category</h3>
      {categories.map((cat) => (
        <CategoryRow key={cat.category} cat={cat} />
      ))}
    </div>
  );
}
