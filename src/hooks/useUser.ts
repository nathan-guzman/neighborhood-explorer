import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { useAppStore } from '@/stores/appStore';
import type { User } from '@/types';

export function useActiveUser(): User | undefined {
  const activeUserId = useAppStore((s) => s.activeUserId);
  return useLiveQuery(
    () => (activeUserId ? db.users.get(activeUserId) : undefined),
    [activeUserId]
  );
}

export function useAllUsers(): User[] | undefined {
  return useLiveQuery(() => db.users.toArray());
}

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createUser(
  username: string,
  pin: string | null
): Promise<number> {
  const pinHash = pin ? await hashPin(pin) : null;
  const now = new Date();
  const id = await db.users.add({
    username,
    pinHash,
    homeLat: null,
    homeLng: null,
    radiusMeters: 805,
    createdAt: now,
    updatedAt: now,
  });
  return id as number;
}

export async function verifyPin(
  user: User,
  pin: string
): Promise<boolean> {
  if (!user.pinHash) return true;
  const hash = await hashPin(pin);
  return hash === user.pinHash;
}

export async function updateUserLocation(
  userId: number,
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<void> {
  await db.users.update(userId, {
    homeLat: lat,
    homeLng: lng,
    radiusMeters,
    updatedAt: new Date(),
  });
}
