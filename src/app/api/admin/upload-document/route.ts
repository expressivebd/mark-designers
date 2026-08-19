import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';
import { buildUploadPath, MAX_DOCUMENT_SIZE_BYTES as MAX_SIZE_BYTES } from '@/lib/upload-path';

const BUCKET = 'documents';

// Legacy proxy upload. The admin panel now uploads directly to Supabase via
// ./sign, because a body sent here is capped at 4.5MB by Vercel. Kept so an
// admin tab still running the pre-direct-upload JS keeps working for small
// files rather than failing outright.
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const folder = (formData.get('folder') as string) || 'uploads';

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File is too large. Max size is 25MB.' }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const path = buildUploadPath(file.name, folder);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path });
}
