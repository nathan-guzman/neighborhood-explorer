import { useCallback, useEffect, useRef } from 'react';
import { useActiveUser } from '@/hooks/useUser';
import { useBusinesses, loadBusinesses } from '@/hooks/useBusinesses';
import { useVisitMap, recordVisit } from '@/hooks/useVisits';
import { useAppStore } from '@/stores/appStore';
import CardStack from '@/components/swipe/CardStack';
import type { Business, VisitStatus } from '@/types';

export default function SwipeScreen() {
  const user = useActiveUser();
  const businesses = useBusinesses();
  const visitMap = useVisitMap();
  const isFetching = useAppStore((s) => s.isFetchingBusinesses);
  const error = useAppStore((s) => s.error);
  const fetchAttempted = useRef(false);

  // Auto-fetch businesses if none exist and user has a location
  useEffect(() => {
    if (
      user?.homeLat != null &&
      user?.homeLng != null &&
      businesses &&
      businesses.length === 0 &&
      !isFetching &&
      !fetchAttempted.current
    ) {
      fetchAttempted.current = true;
      loadBusinesses(user.homeLat, user.homeLng, user.radiusMeters);
    }
  }, [user, businesses, isFetching]);

  const handleSwipe = useCallback(
    (business: Business, status: VisitStatus) => {
      if (!user?.id || business.id === undefined) return;
      recordVisit(user.id, business.id, status);
    },
    [user]
  );

  const handleRetry = () => {
    if (user?.homeLat != null && user?.homeLng != null) {
      fetchAttempted.current = false;
      loadBusinesses(user.homeLat, user.homeLng, user.radiusMeters);
    }
  };

  if (!user || !businesses || !visitMap) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-gray-500">Finding businesses near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="mb-2 text-lg font-semibold text-gray-600">Failed to load businesses</p>
        <p className="mb-4 text-sm text-gray-400">{error}</p>
        <button
          onClick={handleRetry}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <CardStack
      businesses={businesses}
      homeLat={user.homeLat!}
      homeLng={user.homeLng!}
      visitMap={visitMap}
      onSwipe={handleSwipe}
    />
  );
}
