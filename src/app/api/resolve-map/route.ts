import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/resolve-map?url=<google_maps_url>
 *
 * Resolves a Google Maps short link (maps.app.goo.gl) or any Maps URL
 * by following HTTP redirects server-side to extract real coordinates,
 * then returns a proper embeddable iframe src and a directions URL.
 */
export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    // Follow all redirects to reach the canonical maps.google.com URL
    const response = await fetch(rawUrl, {
      redirect: 'follow',
      headers: {
        // Identify as a browser so Google doesn't return a stripped response
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    const finalUrl = response.url;

    // ── 1. Try to extract @LAT,LNG,ZOOMz from the resolved URL ──────────────────
    const coordsMatch = finalUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+(?:\.\d+)?)z/);
    if (coordsMatch) {
      const lat = coordsMatch[1];
      const lng = coordsMatch[2];
      const zoom = Math.min(20, Math.round(parseFloat(coordsMatch[3])));
      return NextResponse.json({
        embedUrl: `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`,
        directionUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        resolvedUrl: finalUrl,
      });
    }

    // ── 2. Fallback: extract place name from /maps/place/PLACE/ ─────────────────
    const placeMatch = finalUrl.match(/\/maps\/place\/([^/@?]+)/);
    if (placeMatch) {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      const encoded = encodeURIComponent(place);
      return NextResponse.json({
        embedUrl: `https://www.google.com/maps?q=${encoded}&output=embed`,
        directionUrl: `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
        resolvedUrl: finalUrl,
      });
    }

    // ── 3. Fallback: use q= param from the resolved URL ─────────────────────────
    const qMatch = finalUrl.match(/[?&]q=([^&]+)/);
    if (qMatch) {
      const q = qMatch[1];
      return NextResponse.json({
        embedUrl: `https://www.google.com/maps?q=${q}&output=embed`,
        directionUrl: `https://www.google.com/maps/dir/?api=1&destination=${decodeURIComponent(q)}`,
        resolvedUrl: finalUrl,
      });
    }

    return NextResponse.json(
      { error: 'Could not extract location from resolved URL', resolvedUrl: finalUrl },
      { status: 422 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to resolve URL', detail: String(err) },
      { status: 500 }
    );
  }
}
