import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { useAppStore } from '@/stores/appStore';
import { useActiveUser } from '@/hooks/useUser';
import { fetchBusinesses } from '@/api/overpass';
import { distanceMeters } from '@/utils/geo';
import type { Business } from '@/types';

export function useBusinesses(): Business[] | undefined {
  const user = useActiveUser();
  return useLiveQuery(async () => {
    const all = await db.businesses.toArray();
    if (user?.homeLat == null || user?.homeLng == null) return all;
    return all.filter(
      (b) => distanceMeters(user.homeLat!, user.homeLng!, b.lat, b.lng) <= user.radiusMeters
    );
  }, [user?.homeLat, user?.homeLng, user?.radiusMeters]);
}

export async function loadBusinesses(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<number> {
  const { setFetchingBusinesses, setError } = useAppStore.getState();
  setFetchingBusinesses(true);
  setError(null);

  try {
    const results = await fetchBusinesses(lat, lng, radiusMeters);

    // Upsert: use osmId to avoid duplicates
    let insertedCount = 0;
    for (const business of results) {
      const existing = await db.businesses
        .where('osmId')
        .equals(business.osmId)
        .first();
      if (existing) {
        await db.businesses.update(existing.id!, {
          ...business,
          fetchedAt: new Date(),
        });
      } else {
        await db.businesses.add(business);
        insertedCount++;
      }
    }

    return insertedCount;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch businesses';
    setError(message);
    throw err;
  } finally {
    setFetchingBusinesses(false);
  }
}
