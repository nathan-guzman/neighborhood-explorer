import { useRef, useState } from 'react';
import { Outlet } from 'react-router';
import BottomNav from './BottomNav';
import { useActiveUser, updateUserLocation } from '@/hooks/useUser';
import { useAppStore } from '@/stores/appStore';
import { loadBusinesses } from '@/hooks/useBusinesses';
import { exportBusinessesCsv, importBusinessesCsv } from '@/utils/csv';
import RadiusSlider from '@/components/onboarding/RadiusSlider';
import { Download, Info, LogOut, Settings, Upload, X } from 'lucide-react';

export default function AppShell() {
  const user = useActiveUser();
  const setActiveUserId = useAppStore((s) => s.setActiveUserId);
  const isFetching = useAppStore((s) => s.isFetchingBusinesses);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [radius, setRadius] = useState<number | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRadius = radius ?? user?.radiusMeters ?? 805;

  const handleExport = async () => {
    if (!user?.id) return;
    try {
      await exportBusinessesCsv(user.id);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setImportMsg(null);
    try {
      const result = await importBusinessesCsv(file, user.id);
      setImportMsg(`Imported ${result.updated} statuses${result.skipped > 0 ? `, ${result.skipped} skipped` : ''}.`);
    } catch (err) {
      setImportMsg(err instanceof Error ? err.message : 'Import failed.');
    }
    // Reset file input so the same file can be re-selected
    e.target.value = '';
  };

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

          <div className="mt-3 border-t border-gray-200 pt-3">
            <span className="mb-2 block text-sm font-semibold text-gray-700">Data</span>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Upload size={16} />
                Import CSV
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            {importMsg && (
              <p className="mt-2 text-xs text-gray-500">{importMsg}</p>
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
