import { useState } from 'react';
import type { Business, VisitStatus } from '@/types';
import { FLAGGED_STATUSES } from '@/types';
import { getDisplayName } from '@/utils/categories';
import { formatDistance, distanceMeters } from '@/utils/geo';
import { Check, X, Minus, Flag, AlertTriangle } from 'lucide-react';

interface Props {
  business: Business;
  status: VisitStatus | undefined;
  homeLat: number;
  homeLng: number;
  onToggle: (newStatus: VisitStatus) => void;
}

const statusConfig: Record<string, { icon: typeof Check; color: string; bg: string }> = {
  visited: { icon: Check, color: 'text-green-500', bg: 'bg-green-50' },
  not_visited: { icon: X, color: 'text-red-400', bg: 'bg-red-50' },
  skipped: { icon: Minus, color: 'text-gray-400', bg: 'bg-gray-50' },
  not_a_business: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-50' },
  closed: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-50' },
  duplicate: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-50' },
  undefined: { icon: Minus, color: 'text-gray-300', bg: 'bg-gray-50' },
};

const flagLabels: Record<string, string> = {
  not_a_business: 'Not a business',
  closed: 'Closed',
  duplicate: 'Duplicate',
};

export default function BusinessListItem({ business, status, homeLat, homeLng, onToggle }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const displayName = getDisplayName(business.name, business.subcategory);
  const distance = distanceMeters(homeLat, homeLng, business.lat, business.lng);
  const config = statusConfig[status ?? 'undefined'];
  const Icon = config.icon;
  const isFlagged = status !== undefined && FLAGGED_STATUSES.includes(status);

  return (
    <div className="relative border-b border-gray-100 bg-white">
      <div className="flex w-full items-center gap-3 px-4 py-3">
        <button
          onClick={() => {
            const next: VisitStatus = status === 'visited' ? 'not_visited' : 'visited';
            onToggle(next);
          }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bg} transition-colors`}
        >
          <Icon size={16} className={config.color} />
        </button>

        <div className="min-w-0 flex-1">
          <div className={`truncate text-sm font-medium ${isFlagged ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {displayName}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{business.subcategory}</span>
            <span>&middot;</span>
            <span>{formatDistance(distance)}</span>
            {isFlagged && (
              <>
                <span>&middot;</span>
                <span className="text-orange-400">{flagLabels[status!]}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowMenu((v) => !v)}
          className="shrink-0 rounded-full p-1.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500"
        >
          <Flag size={14} />
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-3 top-full z-10 rounded-lg border border-gray-200 bg-white py-1 shadow-lg min-w-[180px]">
          <button
            onClick={() => { onToggle('not_a_business'); setShowMenu(false); }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Not a real business
          </button>
          <button
            onClick={() => { onToggle('closed'); setShowMenu(false); }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Permanently closed
          </button>
          <button
            onClick={() => { onToggle('duplicate'); setShowMenu(false); }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Duplicate
          </button>
          {isFlagged && (
            <button
              onClick={() => { onToggle('not_visited'); setShowMenu(false); }}
              className="w-full border-t border-gray-100 px-3 py-2 text-left text-sm text-blue-600 hover:bg-gray-50"
            >
              Unflag
            </button>
          )}
          <button
            onClick={() => setShowMenu(false)}
            className="w-full border-t border-gray-100 px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
