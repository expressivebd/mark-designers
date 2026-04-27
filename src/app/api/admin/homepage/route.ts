import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import type { HomepageData } from '@/lib/data';

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const collection = db.collection<HomepageData & { _id: string }>('homepage');
  const doc = await collection.findOne({ _id: 'homepage' });
  return NextResponse.json(doc || null);
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();

  if (!payload?.hero || !payload?.about || !payload?.sustainability) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!Array.isArray(payload.sustainability) || payload.sustainability.length !== 3) {
    return NextResponse.json({ error: 'Sustainability must have 3 items' }, { status: 400 });
  }

  const db = await getDb();
  const collection = db.collection<HomepageData & { _id: string }>('homepage');
  const updated = {
    hero: payload.hero,
    about: payload.about,
    sustainability: payload.sustainability,
    updatedAt: new Date(),
  };

  await collection.updateOne(
    { _id: 'homepage' },
    { $set: updated, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
