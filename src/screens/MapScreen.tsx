import { useMemo } from 'react';
import { useActiveUser } from '@/hooks/useUser';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useVisitMap, recordVisit } from '@/hooks/useVisits';
import { useAppStore } from '@/stores/appStore';
import ExplorerMap from '@/components/map/ExplorerMap';
import FilterBar from '@/components/list/FilterBar';
import { filterBusinesses } from '@/utils/filterBusinesses';
import type { VisitStatus } from '@/types';

export default function MapScreen() {
  const user = useActiveUser();
  const businesses = useBusinesses();
  const visitMap = useVisitMap();
  const listFilter = useAppStore((s) => s.listFilter);

  const categories = useMemo(() => {
    if (!businesses) return [];
    const cats = new Set(businesses.map((b) => b.category));
    return Array.from(cats).sort();
  }, [businesses]);

  const filtered = useMemo(() => {
    if (!businesses || !visitMap) return [];
    return filterBusinesses(businesses, visitMap, listFilter);
  }, [businesses, visitMap, listFilter]);

  if (!user || !businesses || !visitMap) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <FilterBar categories={categories} />
      <div className="relative flex-1">
        <ExplorerMap
          lat={user.homeLat!}
          lng={user.homeLng!}
          radiusMeters={user.radiusMeters}
          businesses={filtered}
          visitMap={visitMap}
          onToggle={(businessId: number, newStatus: VisitStatus) => {
            if (user.id) {
              recordVisit(user.id, businessId, newStatus);
            }
          }}
        />
        <div className="absolute bottom-2 left-2 z-[1000] rounded bg-white/90 px-2 py-1 text-xs text-gray-600 shadow">
          {filtered.length} of {businesses.length} businesses
        </div>
      </div>
    </div>
  );
}
