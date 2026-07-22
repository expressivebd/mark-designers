import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';

const BUCKET = 'documents';
const MAX_SIZE_BYTES = 25 * 1024 * 1024;

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

  const originalName = file.name || 'file';
  const extMatch = originalName.match(/\.[a-zA-Z0-9]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : '';
  const base =
    originalName
      .replace(/\.[a-zA-Z0-9]+$/, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .slice(0, 60) || 'file';
  const path = `${folder}/${base}-${Date.now().toString(36)}${ext}`;

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
