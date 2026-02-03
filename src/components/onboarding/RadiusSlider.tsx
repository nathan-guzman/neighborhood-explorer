import { MIN_RADIUS_MILES, MAX_RADIUS_MILES, MILES_TO_METERS } from '@/utils/constants';

interface Props {
  radiusMeters: number;
  onChange: (meters: number) => void;
}

export default function RadiusSlider({ radiusMeters, onChange }: Props) {
  const miles = radiusMeters / MILES_TO_METERS;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Radius</label>
        <span className="text-sm font-semibold text-blue-600">
          {miles % 1 === 0 ? miles.toFixed(0) : miles.toFixed(2).replace(/0$/, '')} mi
        </span>
      </div>
      <input
        type="range"
        min={MIN_RADIUS_MILES}
        max={MAX_RADIUS_MILES}
        step={0.25}
        value={miles}
        onChange={(e) => onChange(parseFloat(e.target.value) * MILES_TO_METERS)}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{MIN_RADIUS_MILES} mi</span>
        <span>{MAX_RADIUS_MILES} mi</span>
      </div>
    </div>
  );
}
