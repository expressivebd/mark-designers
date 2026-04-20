import { NextResponse } from 'next/server';
import { getContactAddresses } from '@/lib/data';

export async function GET() {
  const addresses = await getContactAddresses();
  return NextResponse.json(addresses);
}
