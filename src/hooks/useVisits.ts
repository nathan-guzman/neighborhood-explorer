import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { useAppStore } from '@/stores/appStore';
import type { Visit, VisitStatus } from '@/types';

export function useVisitsForUser(): Visit[] | undefined {
  const activeUserId = useAppStore((s) => s.activeUserId);
  return useLiveQuery(
    () =>
      activeUserId
        ? db.visits.where('userId').equals(activeUserId).toArray()
        : [],
    [activeUserId]
  );
}

export function useVisitMap(): Map<number, VisitStatus> | undefined {
  const visits = useVisitsForUser();
  if (!visits) return undefined;
  const map = new Map<number, VisitStatus>();
  for (const v of visits) {
    map.set(v.businessId, v.status);
  }
  return map;
}

export async function recordVisit(
  userId: number,
  businessId: number,
  status: VisitStatus
): Promise<void> {
  // Upsert by userId + businessId
  const existing = await db.visits
    .where('[userId+businessId]')
    .equals([userId, businessId])
    .first();

  if (existing) {
    await db.visits.update(existing.id!, {
      status,
      timestamp: new Date(),
    });
  } else {
    await db.visits.add({
      userId,
      businessId,
      status,
      timestamp: new Date(),
    });
  }
}
