import { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FLAGGED_STATUSES } from '@/types';
import type { Business, VisitStatus } from '@/types';
import { getDisplayName } from '@/utils/categories';

function createColoredIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
    <circle cx="12.5" cy="12.5" r="6" fill="white" opacity="0.9"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  });
}

const visitedIcon = createColoredIcon('#22c55e');
const notVisitedIcon = createColoredIcon('#ef4444');
const unreviewedIcon = createColoredIcon('#9ca3af');
const flaggedIcon = createColoredIcon('#f97316');

interface Props {
  business: Business;
  status: VisitStatus | undefined;
  onToggle: (newStatus: VisitStatus) => void;
}

export default function BusinessMarker({ business, status, onToggle }: Props) {
  const [showFlagMenu, setShowFlagMenu] = useState(false);
  const displayName = getDisplayName(business.name, business.subcategory);
  const isFlagged = status !== undefined && FLAGGED_STATUSES.includes(status);
  const icon = isFlagged
    ? flaggedIcon
    : status === 'visited'
      ? visitedIcon
      : status === 'not_visited'
        ? notVisitedIcon
        : unreviewedIcon;

  return (
    <Marker position={[business.lat, business.lng]} icon={icon}>
      <Popup>
        <div className="min-w-[140px]">
          <div className={`font-semibold ${isFlagged ? 'line-through text-gray-400' : ''}`}>{displayName}</div>
          <div className="text-xs text-gray-500">{business.subcategory}</div>
          {isFlagged && (
            <div className="mt-1 text-xs font-medium text-orange-500">
              {status === 'not_a_business' ? 'Not a business' : status === 'closed' ? 'Permanently closed' : 'Duplicate'}
            </div>
          )}
          {business.address && (
            <div className="mt-1 text-xs text-gray-400">{business.address}</div>
          )}
          {isFlagged ? (
            <button
              onClick={() => onToggle('not_visited')}
              className="mt-2 w-full rounded bg-gray-400 px-2 py-1 text-xs font-medium text-white hover:bg-gray-500"
            >
              Unflag
            </button>
          ) : (
            <>
              <div className="mt-2 flex gap-1">
                <button
                  onClick={() => onToggle('not_visited')}
                  className={`flex-1 rounded px-2 py-1 text-xs font-medium ${
                    status === 'not_visited'
                      ? 'bg-red-400 text-white'
                      : 'bg-red-50 text-red-500 hover:bg-red-100'
                  }`}
                >
                  Not Visited
                </button>
                <button
                  onClick={() => onToggle('visited')}
                  className={`flex-1 rounded px-2 py-1 text-xs font-medium ${
                    status === 'visited'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  Visited
                </button>
              </div>
              <div className="mt-1 space-y-1" style={{ display: showFlagMenu ? 'block' : 'none' }}>
                <button
                  onClick={() => { onToggle('not_a_business'); setShowFlagMenu(false); }}
                  className="w-full rounded bg-orange-50 px-2 py-1 text-xs text-orange-600 hover:bg-orange-100"
                >
                  Not a real business
                </button>
                <button
                  onClick={() => { onToggle('closed'); setShowFlagMenu(false); }}
                  className="w-full rounded bg-orange-50 px-2 py-1 text-xs text-orange-600 hover:bg-orange-100"
                >
                  Permanently closed
                </button>
                <button
                  onClick={() => { onToggle('duplicate'); setShowFlagMenu(false); }}
                  className="w-full rounded bg-orange-50 px-2 py-1 text-xs text-orange-600 hover:bg-orange-100"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => setShowFlagMenu(false)}
                  className="w-full rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => setShowFlagMenu(true)}
                className="mt-1 w-full text-center text-xs text-orange-400 hover:text-orange-500"
                style={{ display: showFlagMenu ? 'none' : 'block' }}
              >
                Flag
              </button>
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
