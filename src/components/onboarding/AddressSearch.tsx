import { useState, useRef, useCallback } from 'react';
import { searchAddress } from '@/api/nominatim';
import { NOMINATIM_DEBOUNCE_MS } from '@/utils/constants';
import { Search, MapPin } from 'lucide-react';
import type { NominatimResult } from '@/api/types';

interface Props {
  onSelect: (lat: number, lng: number, displayName: string) => void;
}

export default function AddressSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 3) {
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await searchAddress(value.trim());
          setResults(res);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, NOMINATIM_DEBOUNCE_MS);
    },
    []
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search for an address..."
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                onClick={() => {
                  onSelect(parseFloat(r.lat), parseFloat(r.lon), r.display_name);
                  setResults([]);
                  setQuery(r.display_name.split(',').slice(0, 2).join(','));
                }}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <span className="line-clamp-2">{r.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
