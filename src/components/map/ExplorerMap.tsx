import { MapContainer, TileLayer } from 'react-leaflet';
import RadiusCircle from './RadiusCircle';
import BusinessMarker from './BusinessMarker';
import type { Business, VisitStatus } from '@/types';

interface Props {
  lat: number;
  lng: number;
  radiusMeters: number;
  businesses: Business[];
  visitMap: Map<number, VisitStatus>;
  onToggle: (businessId: number, newStatus: VisitStatus) => void;
}

export default function ExplorerMap({
  lat,
  lng,
  radiusMeters,
  businesses,
  visitMap,
  onToggle,
}: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      maxZoom={20}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={20}
        maxNativeZoom={19}
      />
      <RadiusCircle lat={lat} lng={lng} radiusMeters={radiusMeters} />
      {businesses.map((b) => (
        <BusinessMarker
          key={b.id}
          business={b}
          status={b.id !== undefined ? visitMap.get(b.id) : undefined}
          onToggle={(newStatus) => {
            if (b.id !== undefined) onToggle(b.id, newStatus);
          }}
        />
      ))}
    </MapContainer>
  );
}
