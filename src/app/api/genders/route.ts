import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection('productGenders').find({}).sort({ createdAt: 1 }).toArray();

    return NextResponse.json(
      docs.map((d) => {
        const slug = String(d.slug || slugify(String(d.name || '')));
        return {
          id: d._id.toString(),
          name: String(d.name || ''),
          slug,
          imageUrl: String(d.imageUrl || ''),
          href: `/products/${slug}`,
        };
      })
    );
  } catch {
    return NextResponse.json([]);
  }
}
