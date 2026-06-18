import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const docs = await db.collection('productGenders').find({}).sort({ createdAt: 1 }).toArray();

  return NextResponse.json(
    docs.map((d) => ({
      id: d._id.toString(),
      name: String(d.name || ''),
      slug: String(d.slug || slugify(String(d.name || ''))),
      imageUrl: String(d.imageUrl || ''),
    }))
  );
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();
  const name = String(payload?.name || '').trim();
  const imageUrl = String(payload?.imageUrl || '').trim();

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const db = await getDb();
  const slug = slugify(name);
  const result = await db.collection('productGenders').insertOne({ name, slug, imageUrl, createdAt: new Date() });

  revalidatePath('/', 'layout');
  return NextResponse.json({ id: result.insertedId.toString(), name, slug, imageUrl });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();
  const id = payload?.id;
  if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });

  const name = String(payload?.name || '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const imageUrl = String(payload?.imageUrl || '').trim();
  const slug = slugify(name);

  const db = await getDb();
  await db.collection('productGenders').updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, slug, imageUrl, updatedAt: new Date() } }
  );

  revalidatePath('/', 'layout');
  return NextResponse.json({ id, name, slug, imageUrl });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();
  const id = payload?.id;
  if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });

  const db = await getDb();
  await db.collection('productGenders').deleteOne({ _id: new ObjectId(id) });

  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
