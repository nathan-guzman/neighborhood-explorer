import { useMemo } from 'react';
import { useActiveUser } from '@/hooks/useUser';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useVisitMap, recordVisit } from '@/hooks/useVisits';
import { useAppStore } from '@/stores/appStore';
import FilterBar from '@/components/list/FilterBar';
import BusinessListItem from '@/components/list/BusinessListItem';
import { FLAGGED_STATUSES } from '@/types';
import type { VisitStatus } from '@/types';
import { getDisplayName } from '@/utils/categories';

export default function ListScreen() {
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

    return businesses.filter((b) => {
      const status = b.id !== undefined ? visitMap.get(b.id) : undefined;

      // Status filter
      if (listFilter.status === 'visited' && status !== 'visited') return false;
      if (listFilter.status === 'not_visited' && status !== 'not_visited') return false;
      if (listFilter.status === 'unreviewed' && status !== undefined) return false;
      if (listFilter.status === 'flagged' && (!status || !FLAGGED_STATUSES.includes(status))) return false;

      // Category filter
      if (listFilter.category && b.category !== listFilter.category) return false;

      // Search
      if (listFilter.searchQuery) {
        const q = listFilter.searchQuery.toLowerCase();
        const displayName = getDisplayName(b.name, b.subcategory).toLowerCase();
        if (
          !displayName.includes(q) &&
          !b.subcategory.toLowerCase().includes(q) &&
          !(b.address || '').toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
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

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No businesses match your filters.
          </div>
        ) : (
          filtered.map((b) => (
            <BusinessListItem
              key={b.id}
              business={b}
              status={b.id !== undefined ? visitMap.get(b.id) : undefined}
              homeLat={user.homeLat!}
              homeLng={user.homeLng!}
              onToggle={(newStatus: VisitStatus) => {
                if (user.id && b.id !== undefined) {
                  recordVisit(user.id, b.id, newStatus);
                }
              }}
            />
          ))
        )}
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-2 text-center text-xs text-gray-400">
        {filtered.length} of {businesses.length} businesses
      </div>
    </div>
  );
}
