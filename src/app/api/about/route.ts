import { NextResponse } from 'next/server';
import { getAboutPage, getCertifications } from '@/lib/data';

const defaultAboutPage = {
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
  const [aboutDoc, certifications] = await Promise.all([
    getAboutPage(),
    getCertifications(),
  ]);

  return NextResponse.json({
    about: aboutDoc || defaultAboutPage,
    certifications,
  });
}
