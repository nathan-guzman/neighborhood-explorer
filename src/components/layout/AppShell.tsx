import { useState } from 'react';
import { Outlet } from 'react-router';
import BottomNav from './BottomNav';
import { useActiveUser, updateUserLocation } from '@/hooks/useUser';
import { useAppStore } from '@/stores/appStore';
import { loadBusinesses } from '@/hooks/useBusinesses';
import RadiusSlider from '@/components/onboarding/RadiusSlider';
import { Info, LogOut, Settings, X } from 'lucide-react';

export default function AppShell() {
  const user = useActiveUser();
  const setActiveUserId = useAppStore((s) => s.setActiveUserId);
  const isFetching = useAppStore((s) => s.isFetchingBusinesses);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
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
        <h1 className="text-lg font-bold text-gray-900">Locale</h1>
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

          <div className="mt-3 border-t border-gray-200 pt-3">
            <button
              onClick={() => setShowAbout((v) => !v)}
              className="flex w-full items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              <Info size={16} />
              About Locale
            </button>
            {showAbout && (
              <div className="mt-2 space-y-2 text-xs text-gray-500">
                <p>Locale helps you discover and track the businesses in your neighborhood.</p>
                <p>Set your home address and a radius, and Locale pulls in every business around you — restaurants, shops, services, and more — using OpenStreetMap data. Swipe through each business to mark it as visited or not visited, building a personal map of the places you know.</p>
                <p>Use the dashboard to see your progress at a glance. The list view lets you filter and search, and the map view shows your visits color-coded on a real map.</p>
                <p>All your data stays on your device — no accounts, no servers, no tracking.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
