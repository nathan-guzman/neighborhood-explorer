import { useMemo } from 'react';
import { useActiveUser } from '@/hooks/useUser';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useVisitMap, recordVisit } from '@/hooks/useVisits';
import { useAppStore } from '@/stores/appStore';
import FilterBar from '@/components/list/FilterBar';
import BusinessListItem from '@/components/list/BusinessListItem';
import { filterBusinesses } from '@/utils/filterBusinesses';
import type { VisitStatus } from '@/types';

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
