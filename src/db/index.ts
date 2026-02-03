import Dexie, { type EntityTable } from 'dexie';
import type { User, Business, Visit } from '@/types';

const db = new Dexie('NeighborhoodExplorer') as Dexie & {
  users: EntityTable<User, 'id'>;
  businesses: EntityTable<Business, 'id'>;
  visits: EntityTable<Visit, 'id'>;
};

db.version(1).stores({
  users: '++id, &username',
  businesses: '++id, &osmId, category, subcategory',
  visits: '++id, userId, businessId, status, [userId+businessId]',
});

export { db };
