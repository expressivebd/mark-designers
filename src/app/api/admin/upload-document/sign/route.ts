import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';
import { buildUploadPath, MAX_DOCUMENT_SIZE_BYTES } from '@/lib/upload-path';

const BUCKET = 'documents';

// Hands the browser a short-lived signed URL so the file goes straight to
// Supabase Storage. Uploading through this function instead would cap the file
// at Vercel's 4.5MB serverless request-body limit (a 413 the app never sees).
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const fileName = typeof body?.fileName === 'string' ? body.fileName : '';
  const fileSize = typeof body?.fileSize === 'number' ? body.fileSize : 0;
  const folder = typeof body?.folder === 'string' && body.folder ? body.folder : 'uploads';

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 });
  }

  if (fileSize > MAX_DOCUMENT_SIZE_BYTES) {
    return NextResponse.json({ error: 'File is too large. Max size is 25MB.' }, { status: 413 });
  }

  const path = buildUploadPath(fileName, folder);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Could not sign upload' }, { status: 500 });
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    provider: 'supabase',
    signedUrl: data.signedUrl,
    path,
    url: publicData.publicUrl,
  });
}
