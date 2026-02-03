import { Circle } from 'react-leaflet';

interface Props {
  lat: number;
  lng: number;
  radiusMeters: number;
}

export default function RadiusCircle({ lat, lng, radiusMeters }: Props) {
  return (
    <Circle
      center={[lat, lng]}
      radius={radiusMeters}
      pathOptions={{
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: '6 4',
      }}
    />
  );
}
