import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';

function mapId(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc as { _id: ObjectId } & Record<string, unknown>;
  return { id: _id.toString(), ...rest };
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const docs = await db.collection('certificationSections').find({}).sort({ order: 1, createdAt: 1 }).toArray();
  return NextResponse.json(docs.map(mapId));
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const db = await getDb();
  const count = await db.collection('certificationSections').countDocuments();

  const doc = {
    heading: payload?.heading || '',
    description: payload?.description || '',
    order: count,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('certificationSections').insertOne(doc);
  revalidatePath('/certifications');
  return NextResponse.json({ id: result.insertedId.toString(), ...doc });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  if (!payload?.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('certificationSections').updateOne(
    { _id: new ObjectId(payload.id) },
    {
      $set: {
        heading: payload?.heading || '',
        description: payload?.description || '',
        updatedAt: new Date(),
      },
    }
  );

  revalidatePath('/certifications');
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
  await db.collection('certificationSections').deleteOne({ _id: new ObjectId(payload.id) });
  revalidatePath('/certifications');
  return NextResponse.json({ ok: true });
}
