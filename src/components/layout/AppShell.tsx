import { useState } from 'react';
import { Outlet } from 'react-router';
import BottomNav from './BottomNav';
import { useActiveUser, updateUserLocation } from '@/hooks/useUser';
import { useAppStore } from '@/stores/appStore';
import { loadBusinesses } from '@/hooks/useBusinesses';
import RadiusSlider from '@/components/onboarding/RadiusSlider';
import { LogOut, Settings, X } from 'lucide-react';

export default function AppShell() {
  const user = useActiveUser();
  const setActiveUserId = useAppStore((s) => s.setActiveUserId);
  const isFetching = useAppStore((s) => s.isFetchingBusinesses);
  const [showSettings, setShowSettings] = useState(false);
  const [radius, setRadius] = useState<number | null>(null);

  const currentRadius = radius ?? user?.radiusMeters ?? 805;

  const handleSaveRadius = async () => {
    if (!user?.id || user.homeLat == null || user.homeLng == null) return;
    await updateUserLocation(user.id, user.homeLat, user.homeLng, currentRadius);
    await loadBusinesses(user.homeLat, user.homeLng, currentRadius);
    setRadius(null);
    setShowSettings(false);
  };

  return (
    <div className="flex h-full flex-col bg-gray-50 pt-[env(safe-area-inset-top)]">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">Neighborhood Explorer</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{user?.username}</span>
          <button
            onClick={() => {
              setRadius(user?.radiusMeters ?? 805);
              setShowSettings((v) => !v);
            }}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setActiveUserId(null)}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Switch profile"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="border-b border-gray-200 bg-white px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Adjust Radius</span>
            <button
              onClick={() => { setShowSettings(false); setRadius(null); }}
              className="rounded-full p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <RadiusSlider radiusMeters={currentRadius} onChange={setRadius} />
          <button
            onClick={handleSaveRadius}
            disabled={isFetching || currentRadius === user?.radiusMeters}
            className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isFetching ? 'Updating...' : 'Update & Re-fetch Businesses'}
          </button>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
