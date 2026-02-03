export interface User {
  id?: number;
  username: string;
  pinHash: string | null;
  homeLat: number | null;
  homeLng: number | null;
  radiusMeters: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id?: number;
  osmId: string;
  name: string | null;
  category: string;
  subcategory: string;
  lat: number;
  lng: number;
  address: string | null;
  osmTags: Record<string, string>;
  fetchedAt: Date;
}

export type VisitStatus = 'visited' | 'not_visited' | 'skipped' | 'not_a_business' | 'closed' | 'duplicate';

export const FLAGGED_STATUSES: VisitStatus[] = ['not_a_business', 'closed', 'duplicate'];

export interface Visit {
  id?: number;
  userId: number;
  businessId: number;
  status: VisitStatus;
  timestamp: Date;
}
