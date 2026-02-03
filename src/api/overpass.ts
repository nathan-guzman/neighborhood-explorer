import { OVERPASS_API_URL, OVERPASS_TIMEOUT_SECONDS } from '@/utils/constants';
import { categorize } from '@/utils/categories';
import type { OverpassResponse } from './types';
import type { Business } from '@/types';

function buildBusinessQuery(lat: number, lng: number, radiusMeters: number): string {
  return `
[out:json][timeout:${OVERPASS_TIMEOUT_SECONDS}];
(
  nwr["amenity"~"^(restaurant|cafe|bar|pub|fast_food|ice_cream|food_court|pharmacy|bank|atm|clinic|dentist|doctors|hospital|veterinary|post_office|library|cinema|theatre|nightclub|arts_centre|community_centre|gym|studio|marketplace)$"](around:${radiusMeters},${lat},${lng});
  nwr["shop"](around:${radiusMeters},${lat},${lng});
  nwr["tourism"~"^(hotel|motel|hostel|guest_house|museum|gallery|attraction|viewpoint|information)$"](around:${radiusMeters},${lat},${lng});
  nwr["leisure"~"^(fitness_centre|sports_centre|swimming_pool|bowling_alley|dance|escape_game|miniature_golf)$"](around:${radiusMeters},${lat},${lng});
  nwr["craft"](around:${radiusMeters},${lat},${lng});
);
out center tags;
  `.trim();
}

function parseAddress(tags: Record<string, string>): string | null {
  const parts: string[] = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (parts.length === 0) return null;
  return parts.join(' ');
}

export async function fetchBusinesses(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<Omit<Business, 'id'>[]> {
  const query = buildBusinessQuery(lat, lng, radiusMeters);

  const response = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
  }

  const data: OverpassResponse = await response.json();
  const now = new Date();

  return data.elements
    .filter((el) => el.tags && Object.keys(el.tags).length > 0)
    .map((el) => {
      const tags = el.tags!;
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;

      if (elLat === undefined || elLng === undefined) return null;

      const { category, subcategory } = categorize(tags);
      const osmId = `${el.type}/${el.id}`;

      return {
        osmId,
        name: tags.name || null,
        category,
        subcategory,
        lat: elLat,
        lng: elLng,
        address: parseAddress(tags),
        osmTags: tags,
        fetchedAt: now,
      };
    })
    .filter((b): b is Omit<Business, 'id'> => b !== null);
}
