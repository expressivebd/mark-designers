import { NextResponse } from 'next/server';
import { getSiteContents } from '@/lib/data';

export async function GET() {
  const contents = await getSiteContents();

  return NextResponse.json({
    catalogUrl: contents?.catalogUrl || '',
    companyProfileUrl: contents?.companyProfileUrl || '',
  });
}
