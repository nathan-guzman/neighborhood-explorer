import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon for Vite bundled environments
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Props {
  lat: number;
  lng: number;
  radiusMeters: number;
  onLocationChange: (lat: number, lng: number) => void;
}

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPreview({ lat, lng, radiusMeters, onLocationChange }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: '220px', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        key={`${lat}-${lng}`}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
        <Circle
          center={[lat, lng]}
          radius={radiusMeters}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
          }}
        />
        <ClickHandler onLocationChange={onLocationChange} />
      </MapContainer>
      <p className="bg-gray-50 px-3 py-1.5 text-center text-xs text-gray-400">
        Tap the map to adjust location
      </p>
    </div>
  );
}
