import { useState, useMemo, useRef, useCallback } from 'react';
import TinderCard from 'react-tinder-card';
import BusinessCard from './BusinessCard';
import SwipeActions from './SwipeActions';
import type { Business, VisitStatus } from '@/types';

interface Props {
  businesses: Business[];
  homeLat: number;
  homeLng: number;
  visitMap: Map<number, VisitStatus>;
  onSwipe: (business: Business, status: VisitStatus) => void;
}

type SwipeDir = 'left' | 'right' | 'up' | 'down';

interface TinderCardAPI {
  swipe: (dir?: SwipeDir) => Promise<void>;
  restoreCard: () => Promise<void>;
}

export default function CardStack({ businesses, homeLat, homeLng, visitMap, onSwipe }: Props) {
  const [swipedIds, setSwipedIds] = useState<Set<number>>(new Set());

  const unreviewed = useMemo(() => {
    return businesses.filter(
      (b) => b.id !== undefined && !visitMap.has(b.id) && !swipedIds.has(b.id!)
    );
  }, [businesses, visitMap, swipedIds]);

  const visibleCards = unreviewed.slice(0, 3);
  const totalReviewed = businesses.length - unreviewed.length;
  const cardRefs = useRef<Map<number, TinderCardAPI>>(new Map());

  const handleSwipe = useCallback(
    (dir: SwipeDir, business: Business) => {
      if (dir === 'right') {
        onSwipe(business, 'visited');
      } else if (dir === 'left') {
        onSwipe(business, 'not_visited');
      }
    },
    [onSwipe]
  );

  const handleCardLeftScreen = useCallback((id: number) => {
    setSwipedIds((prev) => new Set(prev).add(id));
    cardRefs.current.delete(id);
  }, []);

  const triggerSwipe = useCallback(
    async (dir: SwipeDir) => {
      const topCard = visibleCards[visibleCards.length - 1];
      if (!topCard?.id) return;
      const ref = cardRefs.current.get(topCard.id);
      if (ref) {
        await ref.swipe(dir);
      }
    },
    [visibleCards]
  );

  const handleSkip = useCallback(() => {
    const topCard = visibleCards[visibleCards.length - 1];
    if (!topCard?.id) return;
    onSwipe(topCard, 'skipped');
    setSwipedIds((prev) => new Set(prev).add(topCard.id!));
    cardRefs.current.delete(topCard.id);
  }, [visibleCards, onSwipe]);

  const handleFlag = useCallback(
    (status: VisitStatus) => {
      const topCard = visibleCards[visibleCards.length - 1];
      if (!topCard?.id) return;
      onSwipe(topCard, status);
      setSwipedIds((prev) => new Set(prev).add(topCard.id!));
      cardRefs.current.delete(topCard.id);
    },
    [visibleCards, onSwipe]
  );

  if (businesses.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold text-gray-600">No businesses found</p>
        <p className="mt-2 text-sm text-gray-400">
          Try adjusting your search radius in settings.
        </p>
      </div>
    );
  }

  if (visibleCards.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-5xl">&#127881;</div>
        <p className="text-lg font-semibold text-gray-600">All reviewed!</p>
        <p className="mt-2 text-sm text-gray-400">
          You've gone through all {businesses.length} businesses.
          Check the Dashboard to see your stats.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-2 text-center text-sm text-gray-400">
        {totalReviewed} of {businesses.length} reviewed
      </div>

      <div
        className="relative mx-4 flex-1"
        style={{ touchAction: 'none' }}
      >
        {visibleCards.map((business, i) => {
          const stackIndex = visibleCards.length - 1 - i;
          return (
            <TinderCard
              key={business.id}
              ref={(el: TinderCardAPI | null) => {
                if (el && business.id !== undefined) {
                  cardRefs.current.set(business.id, el);
                }
              }}
              onSwipe={(dir: SwipeDir) => handleSwipe(dir, business)}
              onCardLeftScreen={() => handleCardLeftScreen(business.id!)}
              preventSwipe={['up', 'down']}
              swipeRequirementType="position"
              swipeThreshold={80}
              className="absolute inset-0"
            >
              <div
                className="h-full rounded-2xl bg-white shadow-lg"
                style={{
                  transform: `scale(${1 - stackIndex * 0.04}) translateY(${stackIndex * 10}px)`,
                  opacity: stackIndex > 0 ? 0.7 : 1,
                }}
              >
                <BusinessCard
                  business={business}
                  homeLat={homeLat}
                  homeLng={homeLng}
                />
              </div>
            </TinderCard>
          );
        })}
      </div>

      <SwipeActions
        onLeft={() => triggerSwipe('left')}
        onRight={() => triggerSwipe('right')}
        onSkip={handleSkip}
        onFlag={handleFlag}
      />
    </div>
  );
}
