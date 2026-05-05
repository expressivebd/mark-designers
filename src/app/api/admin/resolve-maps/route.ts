import { NextResponse } from 'next/server';
import { extractMapInfo, buildPbEmbedUrl } from '@/lib/maps';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'url parameter is required' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    clearTimeout(timeout);

    const resolvedUrl = response.url;
    const info = extractMapInfo(resolvedUrl);

    if (info) {
      const embedUrl = buildPbEmbedUrl(info.lat, info.lng, info.zoom);
      return NextResponse.json({ embedUrl, resolvedUrl });
    }

    return NextResponse.json({ error: 'Could not extract coordinates', resolvedUrl }, { status: 422 });
  } catch {
    return NextResponse.json({ error: 'Failed to resolve URL' }, { status: 500 });
  }
}
