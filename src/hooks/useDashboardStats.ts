import { useMemo } from 'react';
import { useBusinesses } from './useBusinesses';
import { useVisitMap } from './useVisits';
import { FLAGGED_STATUSES } from '@/types';

export interface CategoryStat {
  category: string;
  total: number;
  visited: number;
  notVisited: number;
  unreviewed: number;
  percentage: number;
}

export interface DashboardStats {
  total: number;
  visited: number;
  notVisited: number;
  unreviewed: number;
  flagged: number;
  percentage: number;
  categories: CategoryStat[];
}

export function useDashboardStats(): DashboardStats | undefined {
  const businesses = useBusinesses();
  const visitMap = useVisitMap();

  return useMemo(() => {
    if (!businesses || !visitMap) return undefined;

    let visited = 0;
    let notVisited = 0;
    let unreviewed = 0;
    let flagged = 0;
    const categoryMap = new Map<
      string,
      { total: number; visited: number; notVisited: number; unreviewed: number }
    >();

    for (const b of businesses) {
      const status = b.id !== undefined ? visitMap.get(b.id) : undefined;

      // Flagged businesses don't count toward totals
      if (status && FLAGGED_STATUSES.includes(status)) {
        flagged++;
        continue;
      }

      if (status === 'visited') visited++;
      else if (status === 'not_visited') notVisited++;
      else unreviewed++;

      const cat = categoryMap.get(b.category) || { total: 0, visited: 0, notVisited: 0, unreviewed: 0 };
      cat.total++;
      if (status === 'visited') cat.visited++;
      else if (status === 'not_visited') cat.notVisited++;
      else cat.unreviewed++;
      categoryMap.set(b.category, cat);
    }

    const total = businesses.length - flagged;
    const categories: CategoryStat[] = Array.from(categoryMap.entries())
      .map(([category, { total: t, visited: v, notVisited: nv, unreviewed: u }]) => ({
        category,
        total: t,
        visited: v,
        notVisited: nv,
        unreviewed: u,
        percentage: t > 0 ? Math.round((v / t) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      total,
      visited,
      notVisited,
      unreviewed,
      flagged,
      percentage: total > 0 ? Math.round((visited / total) * 100) : 0,
      categories,
    };
  }, [businesses, visitMap]);
}
