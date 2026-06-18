import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
import { getProductGenders } from '@/lib/data';

export async function POST() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Revalidate the entire layout — hits every cached page in the app.
  revalidatePath('/', 'layout');

  // Also explicitly revalidate every known gender page so they regenerate
  // on the next request even if they were never visited before.
  try {
    const genders = await getProductGenders();
    for (const g of genders) {
      revalidatePath(`/products/${g.slug}`, 'page');
    }
  } catch {
    // Non-fatal — layout revalidation already covers everything
  }

  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
