import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/admin';

// Signs a direct browser -> Cloudinary upload. Same reason as the document
// signer: routing the bytes through this function would cap uploads at
// Vercel's 4.5MB serverless request-body limit.
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const folder =
    typeof body?.folder === 'string' && body.folder ? body.folder : 'mark-designers';

  const timestamp = Math.round(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 });
  }

  // Only the params signed here may be sent by the browser; Cloudinary rejects
  // the upload if the client adds or changes any of them.
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);

  return NextResponse.json({
    provider: 'cloudinary',
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
  });
}
