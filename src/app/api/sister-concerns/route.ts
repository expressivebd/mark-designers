import { NextResponse } from 'next/server';
import { getSisterConcerns } from '@/lib/data';

export async function GET() {
  const concerns = await getSisterConcerns();

  return NextResponse.json(
    concerns.map((concern) => ({
      id: concern.id,
      name: concern.name,
      href: concern.link,
    }))
  );
}
