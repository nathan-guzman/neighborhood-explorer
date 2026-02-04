import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { updateUserLocation } from '@/hooks/useUser';
import { useGeolocation } from '@/hooks/useGeolocation';
import { loadBusinesses } from '@/hooks/useBusinesses';
import AddressSearch from '@/components/onboarding/AddressSearch';
import RadiusSlider from '@/components/onboarding/RadiusSlider';
import LocationPreview from '@/components/onboarding/LocationPreview';
import { DEFAULT_RADIUS_METERS } from '@/utils/constants';
import { Navigation } from 'lucide-react';

export default function OnboardingScreen() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_RADIUS_METERS);
  const [saving, setSaving] = useState(false);
  const geo = useGeolocation();

  const handleAddressSelect = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleUseMyLocation = () => {
    geo.requestLocation();
  };

  // Sync browser geolocation result
  if (geo.lat !== null && geo.lng !== null && lat === null) {
    setLat(geo.lat);
    setLng(geo.lng);
  }

  const handleSave = async () => {
    if (!activeUserId || lat === null || lng === null) return;
    setSaving(true);
    try {
      // Fetch businesses first, before updating location.
      // Updating location triggers a redirect to the main app,
      // so we need businesses loaded before that happens.
      await loadBusinesses(lat, lng, radiusMeters);
      await updateUserLocation(activeUserId, lat, lng, radiusMeters);
    } catch (err) {
      console.error('Setup error:', err);
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex-1 overflow-auto px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Welcome to Locale
        </h1>
        <p className="mb-2 text-sm text-gray-500">
          Locale helps you discover and track the businesses in your neighborhood. Set your home address and a radius, and Locale pulls in every business around you — restaurants, shops, services, and more.
        </p>
        <p className="mb-6 text-sm text-gray-500">
          Swipe through businesses to mark them as visited or not, track your progress on the dashboard, and see everything color-coded on the map. All your data stays on your device.
        </p>

        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Set Your Home Base
        </h2>
        <p className="mb-4 text-gray-500">
          Choose a location to explore the businesses around it.
        </p>

        <div className="space-y-5">
          <AddressSearch onSelect={handleAddressSelect} />

          <button
            onClick={handleUseMyLocation}
            disabled={geo.loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Navigation size={16} />
            {geo.loading ? 'Getting location...' : 'Use my current location'}
          </button>

          {geo.error && (
            <p className="text-sm text-red-500">{geo.error}</p>
          )}

          {lat !== null && lng !== null && (
            <>
              <LocationPreview
                lat={lat}
                lng={lng}
                radiusMeters={radiusMeters}
                onLocationChange={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
              />

              <RadiusSlider
                radiusMeters={radiusMeters}
                onChange={setRadiusMeters}
              />
            </>
          )}
        </div>
      </div>

      {lat !== null && lng !== null && (
        <div className="border-t border-gray-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Finding businesses...' : 'Start Exploring'}
          </button>
        </div>
      )}
    </div>
  );
}
