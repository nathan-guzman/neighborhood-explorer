import { NOMINATIM_URL, APP_USER_AGENT } from '@/utils/constants';
import type { NominatimResult } from './types';

export async function searchAddress(query: string): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '5',
    addressdetails: '1',
  });

  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: { 'User-Agent': APP_USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Nominatim error: ${res.status}`);
  }

  return res.json();
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<NominatimResult> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: 'json',
  });

  const res = await fetch(`${NOMINATIM_URL}/reverse?${params}`, {
    headers: { 'User-Agent': APP_USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Nominatim reverse error: ${res.status}`);
  }

  return res.json();
}
