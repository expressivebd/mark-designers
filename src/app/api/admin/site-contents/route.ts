import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import type { SiteContentsData } from '@/lib/data';

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const collection = db.collection<SiteContentsData & { _id: string }>('siteContents');
  const doc = await collection.findOne({ _id: 'siteContents' });
  return NextResponse.json(doc || null);
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();

  const db = await getDb();
  const collection = db.collection<SiteContentsData & { _id: string }>('siteContents');
  const updated = {
    catalogUrl: String(payload?.catalogUrl || '').trim(),
    companyProfileUrl: String(payload?.companyProfileUrl || '').trim(),
    updatedAt: new Date(),
  };

  await collection.updateOne(
    { _id: 'siteContents' },
    { $set: updated, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
