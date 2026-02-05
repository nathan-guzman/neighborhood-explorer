import type { Business, VisitStatus } from '@/types';
import type { ListFilter } from '@/stores/appStore';
import { FLAGGED_STATUSES } from '@/types';
import { getDisplayName } from '@/utils/categories';

export function filterBusinesses(
  businesses: Business[],
  visitMap: Map<number, VisitStatus>,
  filter: ListFilter
): Business[] {
  return businesses.filter((b) => {
    const status = b.id !== undefined ? visitMap.get(b.id) : undefined;

    // Status filter (empty array = show all)
    if (filter.statuses.length > 0) {
      let matches = false;
      for (const s of filter.statuses) {
        if (s === 'visited' && status === 'visited') matches = true;
        if (s === 'not_visited' && status === 'not_visited') matches = true;
        if (s === 'unreviewed' && status === undefined) matches = true;
        if (s === 'flagged' && status && FLAGGED_STATUSES.includes(status)) matches = true;
      }
      if (!matches) return false;
    }

    // Category filter (empty array = show all)
    if (filter.categories.length > 0 && !filter.categories.includes(b.category)) {
      return false;
    }

    // Search
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
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
}
