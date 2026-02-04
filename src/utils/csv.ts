import { db } from '@/db';
import type { VisitStatus } from '@/types';

interface ExportRow {
  profile: string;
  homeLat: string;
  homeLng: string;
  radiusMeters: string;
  osmId: string;
  name: string;
  category: string;
  subcategory: string;
  lat: number;
  lng: number;
  address: string;
  status: string;
}

const CSV_HEADERS: (keyof ExportRow)[] = [
  'profile', 'homeLat', 'homeLng', 'radiusMeters',
  'osmId', 'name', 'category', 'subcategory', 'lat', 'lng', 'address', 'status',
];

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

export async function exportBusinessesCsv(userId: number): Promise<void> {
  const user = await db.users.get(userId);
  const businesses = await db.businesses.toArray();
  const visits = await db.visits.where('userId').equals(userId).toArray();
  const visitMap = new Map(visits.map((v) => [v.businessId, v.status]));

  const profileName = user?.username ?? '';
  const homeLat = user?.homeLat != null ? String(user.homeLat) : '';
  const homeLng = user?.homeLng != null ? String(user.homeLng) : '';
  const radiusMeters = user?.radiusMeters != null ? String(user.radiusMeters) : '';

  const rows = businesses.map((b): ExportRow => ({
    profile: profileName,
    homeLat,
    homeLng,
    radiusMeters,
    osmId: b.osmId,
    name: b.name ?? '',
    category: b.category,
    subcategory: b.subcategory,
    lat: b.lat,
    lng: b.lng,
    address: b.address ?? '',
    status: visitMap.get(b.id!) ?? 'unreviewed',
  }));

  const csvLines = [
    CSV_HEADERS.join(','),
    ...rows.map((row) =>
      CSV_HEADERS.map((h) => escapeCsvField(String(row[h]))).join(',')
    ),
  ];

  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `locale-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const VALID_STATUSES: Set<string> = new Set([
  'visited', 'not_visited', 'skipped', 'not_a_business', 'closed', 'duplicate', 'unreviewed',
]);

export async function importBusinessesCsv(
  file: File,
  userId: number
): Promise<{ updated: number; skipped: number }> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows.');
  }

  const headerLine = parseCsvLine(lines[0]);
  const osmIdIdx = headerLine.indexOf('osmId');
  const statusIdx = headerLine.indexOf('status');

  if (osmIdIdx === -1 || statusIdx === -1) {
    throw new Error('CSV must include "osmId" and "status" columns.');
  }

  let updated = 0;
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const osmId = fields[osmIdIdx]?.trim();
    const status = fields[statusIdx]?.trim();

    if (!osmId || !status) {
      skipped++;
      continue;
    }

    if (status === 'unreviewed') {
      // No visit record needed for unreviewed
      continue;
    }

    if (!VALID_STATUSES.has(status)) {
      skipped++;
      continue;
    }

    const business = await db.businesses.where('osmId').equals(osmId).first();
    if (!business?.id) {
      skipped++;
      continue;
    }

    const existingVisit = await db.visits
      .where('[userId+businessId]')
      .equals([userId, business.id])
      .first();

    if (existingVisit) {
      await db.visits.update(existingVisit.id!, {
        status: status as VisitStatus,
        timestamp: new Date(),
      });
    } else {
      await db.visits.add({
        userId,
        businessId: business.id,
        status: status as VisitStatus,
        timestamp: new Date(),
      });
    }
    updated++;
  }

  return { updated, skipped };
}
