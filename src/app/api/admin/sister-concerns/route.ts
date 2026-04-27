import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';

function mapId(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc as { _id: ObjectId } & Record<string, unknown>;
  return { id: _id.toString(), ...rest };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function sanitizePayload(payload: Record<string, unknown>) {
  const currentYear = new Date().getFullYear();
  const name = String(payload?.name || '').trim();
  const slug = slugify(name);
  const establishedYearNumber = Number(payload?.establishedYear || 0);
  const establishedYear =
    Number.isFinite(establishedYearNumber) && establishedYearNumber > 0
      ? String(Math.floor(establishedYearNumber))
      : '';
  const yearsInOperation =
    establishedYear && Number(establishedYear) <= currentYear
      ? currentYear - Number(establishedYear)
      : 0;

  return {
    name,
    tagline: String(payload?.tagline || '').trim(),
    slug,
    link: slug ? `/sister-concerns/${slug}` : '/sister-concerns',
    thumbnailUrl: String(payload?.thumbnailUrl || payload?.imageUrl || '').trim(),
    description: String(payload?.description || '').trim(),
    establishedYear,
    location: String(payload?.location || '').trim(),
    capacity: String(payload?.capacity || '').trim(),
    personnel: String(payload?.personnel || '').trim(),
    yearsInOperation,
    totalMachines: String(payload?.totalMachines || '').trim(),
    factoryPhotos: Array.isArray(payload?.factoryPhotos)
      ? payload.factoryPhotos.filter((photo): photo is string => typeof photo === 'string' && photo.trim().length > 0)
      : [],
  };
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const docs = await db.collection('sisterConcerns').find({}).sort({ order: 1, createdAt: 1 }).toArray();
  return NextResponse.json(docs.map(mapId));
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const doc = {
    ...sanitizePayload(payload),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const db = await getDb();
  const result = await db.collection('sisterConcerns').insertOne(doc);
  revalidatePath('/', 'layout');
  return NextResponse.json({ id: result.insertedId.toString(), ...doc });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  if (!payload?.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  const id = String(payload.id);

  const db = await getDb();
  await db.collection('sisterConcerns').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...sanitizePayload(payload),
        updatedAt: new Date(),
      },
    }
  );

  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  if (!payload?.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('sisterConcerns').deleteOne({ _id: new ObjectId(payload.id) });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
