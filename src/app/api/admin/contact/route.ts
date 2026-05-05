import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { requireAdmin } from '@/lib/admin';
import { getDb } from '@/lib/mongodb';
import { extractMapInfo, buildPbEmbedUrl } from '@/lib/maps';

function mapId(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc as { _id: ObjectId } & Record<string, unknown>;
  return { id: _id.toString(), ...rest };
}

function isGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.hostname === 'maps.app.goo.gl' ||
      url.hostname === 'goo.gl' ||
      (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) ||
      (url.hostname === 'google.com' && url.pathname.startsWith('/maps'))
    );
  } catch {
    return false;
  }
}

async function resolveShortLinkToEmbed(shortLink: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(shortLink, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);
    const info = extractMapInfo(response.url);
    if (info) return buildPbEmbedUrl(info.lat, info.lng, info.zoom);
    return null;
  } catch {
    return null;
  }
}

async function normalizePayload(payload: Record<string, unknown>) {
  const title = String(payload.title || '').trim();
  const fullAddress = String(payload.fullAddress || '').trim();
  const mapLocation = String(payload.mapLocation || fullAddress || '').trim();
  const phones = Array.isArray(payload.phones)
    ? payload.phones
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    : [];
  const emails = Array.isArray(payload.emails)
    ? payload.emails
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  // Embed URL priority:
  // 1. Direct embed src URL (https://www.google.com/maps/embed?pb=...) → use as-is, perfect single pin
  // 2. Share link (maps.app.goo.gl/...) → resolve server-side to coordinates → build pb embed URL
  // 3. Plain address text → address-based geocoding fallback
  const addrForEmbed = fullAddress || (mapLocation && !isGoogleMapsUrl(mapLocation) ? mapLocation : '');
  let mapEmbedUrl = '';
  if (mapLocation.startsWith('https://www.google.com/maps/embed')) {
    mapEmbedUrl = mapLocation;
  } else if (mapLocation && isGoogleMapsUrl(mapLocation)) {
    const resolved = await resolveShortLinkToEmbed(mapLocation);
    mapEmbedUrl = resolved ?? (addrForEmbed ? `https://maps.google.com/maps?q=${encodeURIComponent(addrForEmbed)}&output=embed` : '');
  } else if (addrForEmbed) {
    mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addrForEmbed)}&output=embed`;
  }

  // Direction URL: embed URLs can't be used for directions — fall back to fullAddress
  let directionUrl = '';
  if (mapLocation.startsWith('https://www.google.com/maps/embed')) {
    if (fullAddress) directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  } else if (mapLocation && isGoogleMapsUrl(mapLocation)) {
    directionUrl = mapLocation;
  } else if (fullAddress) {
    directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  } else if (mapLocation) {
    directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapLocation)}`;
  }

  return { title, fullAddress, phones, emails, mapLocation, mapEmbedUrl, directionUrl };
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const docs = await db
    .collection('contactAddresses')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();

  return NextResponse.json(docs.map(mapId));
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const doc = {
    ...(await normalizePayload(payload)),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const db = await getDb();
  const result = await db.collection('contactAddresses').insertOne(doc);
  revalidatePath('/contact');
  return NextResponse.json({ id: result.insertedId.toString(), ...doc });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  if (!payload.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('contactAddresses').updateOne(
    { _id: new ObjectId(String(payload.id)) },
    {
      $set: {
        ...(await normalizePayload(payload)),
        updatedAt: new Date(),
      },
    }
  );

  revalidatePath('/contact');
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  if (!payload.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('contactAddresses').deleteOne({ _id: new ObjectId(String(payload.id)) });
  revalidatePath('/contact');
  return NextResponse.json({ ok: true });
}
