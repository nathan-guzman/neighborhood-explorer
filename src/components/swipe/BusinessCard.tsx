import type { Business } from '@/types';
import { getDisplayName } from '@/utils/categories';
import { formatDistance, distanceMeters } from '@/utils/geo';
import { MapPin, Tag } from 'lucide-react';

interface Props {
  business: Business;
  homeLat: number;
  homeLng: number;
}

export default function BusinessCard({ business, homeLat, homeLng }: Props) {
  const displayName = getDisplayName(business.name, business.subcategory);
  const distance = distanceMeters(homeLat, homeLng, business.lat, business.lng);

  return (
    <div className="flex h-full flex-col overflow-hidden p-6">
      <span className="mb-3 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        {business.category}
      </span>

      <h2 className="mb-1 text-2xl font-bold text-gray-900 leading-tight">
        {displayName}
      </h2>

      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
        <Tag size={14} className="shrink-0" />
        <span>{business.subcategory}</span>
      </div>

      {business.address && (
        <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin size={14} className="shrink-0" />
          <span>{business.address}</span>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-400">
          {formatDistance(distance)} away
        </span>
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-300 select-none">
        <span>&larr; Haven't been</span>
        <span>I've been &rarr;</span>
      </div>
    </div>
  );
}
