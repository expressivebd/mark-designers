import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import type { AboutPageData } from '@/lib/data';

const defaultAboutPage: AboutPageData = {
  journey: '',
  stats: [
    { label: 'Total Sister Concerns', number: 3, suffix: '' },
    { label: 'Daily Capacity (pcs)', number: 45000, suffix: '+' },
    { label: 'Total Personnel', number: 8000, suffix: '+' },
    { label: 'Years of Experience', number: 30, suffix: '+' },
  ],
  facilities: [],
  expertise: [],
};

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const doc = await db
    .collection<AboutPageData & { _id: string }>('aboutPage')
    .findOne({ _id: 'about' });

  return NextResponse.json(doc || defaultAboutPage);
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<AboutPageData>;

  const normalized: AboutPageData = {
    journey: String(payload?.journey || ''),
    stats: Array.isArray(payload?.stats) ? payload.stats.map((item) => ({
      label: String(item.label || ''),
      number: Number(item.number || 0),
      suffix: String(item.suffix || ''),
    })) : defaultAboutPage.stats,
    facilities: Array.isArray(payload?.facilities) ? payload.facilities.map((item) => ({
      name: String(item.name || ''),
      imageUrl: String(item.imageUrl || ''),
    })) : [],
    expertise: Array.isArray(payload?.expertise) ? payload.expertise.map((item) => ({
      name: String(item.name || ''),
      details: String(item.details || ''),
      imageUrl: String(item.imageUrl || ''),
    })) : [],
  };

  const db = await getDb();
  await db.collection<AboutPageData & { _id: string }>('aboutPage').updateOne(
    { _id: 'about' },
    {
      $set: {
        ...normalized,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  revalidatePath('/about');
  return NextResponse.json({ ok: true });
}
