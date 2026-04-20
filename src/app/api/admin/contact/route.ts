import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAdmin } from '@/lib/admin';
import { getDb } from '@/lib/mongodb';

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

function normalizePayload(payload: Record<string, unknown>) {
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

  // Embed: always derive from plain-text fullAddress — geocoding is reliable and needs no network call
  const addrForEmbed = fullAddress || (mapLocation && !isGoogleMapsUrl(mapLocation) ? mapLocation : '');
  const mapEmbedUrl = addrForEmbed
    ? `https://maps.google.com/maps?q=${encodeURIComponent(addrForEmbed)}&output=embed`
    : '';

  // Direction: the share link opens the exact pinned location in Google Maps (browsers follow the redirect)
  let directionUrl = '';
  if (mapLocation && isGoogleMapsUrl(mapLocation)) {
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
    ...normalizePayload(payload),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const db = await getDb();
  const result = await db.collection('contactAddresses').insertOne(doc);
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
        ...normalizePayload(payload),
        updatedAt: new Date(),
      },
    }
  );

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
  return NextResponse.json({ ok: true });
}
