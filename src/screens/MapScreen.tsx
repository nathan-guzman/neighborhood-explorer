import { useActiveUser } from '@/hooks/useUser';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useVisitMap, recordVisit } from '@/hooks/useVisits';
import ExplorerMap from '@/components/map/ExplorerMap';
import type { VisitStatus } from '@/types';

export default function MapScreen() {
  const user = useActiveUser();
  const businesses = useBusinesses();
  const visitMap = useVisitMap();

  if (!user || !businesses || !visitMap) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ExplorerMap
      lat={user.homeLat!}
      lng={user.homeLng!}
      radiusMeters={user.radiusMeters}
      businesses={businesses}
      visitMap={visitMap}
      onToggle={(businessId: number, newStatus: VisitStatus) => {
        if (user.id) {
          recordVisit(user.id, businessId, newStatus);
        }
      }}
    />
  );
}
