import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';

function mapId(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc as { _id: ObjectId } & Record<string, unknown>;
  return { id: _id.toString(), ...rest };
}

type ClientStatsDoc = {
  _id: string;
  countriesServed?: string;
  yearsServed?: string;
  satisfactionPercentage?: string;
};

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const [docs, statsDoc] = await Promise.all([
    db.collection('clients').find({}).sort({ order: 1, createdAt: 1 }).toArray(),
    db.collection<ClientStatsDoc>('settings').findOne({ _id: 'clientStats' } as any),
  ]);

  const items = docs.map(mapId);

  return NextResponse.json({
    items,
    stats: {
      totalClients: items.length,
      countriesServed: String(statsDoc?.countriesServed || ''),
      yearsServed: String(statsDoc?.yearsServed || ''),
      satisfactionPercentage: String(statsDoc?.satisfactionPercentage || ''),
    },
  });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const doc = {
    name: payload?.name || '',
    logoUrl: payload?.logoUrl || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const db = await getDb();
  const result = await db.collection('clients').insertOne(doc);
  return NextResponse.json({ id: result.insertedId.toString(), ...doc });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();

  const db = await getDb();

  if (payload?.action === 'updateStats') {
    await db.collection<{ _id: string }>('settings').updateOne(
      { _id: 'clientStats' } as any,
      {
        $set: {
          countriesServed: String(payload?.countriesServed || '').trim(),
          yearsServed: String(payload?.yearsServed || '').trim(),
          satisfactionPercentage: String(payload?.satisfactionPercentage || '').trim(),
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  }

  if (!payload?.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await db.collection('clients').updateOne(
    { _id: new ObjectId(payload.id) },
    {
      $set: {
        name: payload?.name || '',
        logoUrl: payload?.logoUrl || '',
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

  const payload = await request.json();
  if (!payload?.id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('clients').deleteOne({ _id: new ObjectId(payload.id) });
  return NextResponse.json({ ok: true });
}
