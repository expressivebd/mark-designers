/**
 * Extract the precise pin location and zoom from a resolved Google Maps URL.
 *
 * Google Maps URLs contain two coordinate sets:
 *   @lat,lng,ZOOMz  — the map VIEW centre (less precise)
 *   !3d{lat}!4d{lng} — the actual PLACE/PIN location (more precise)
 *
 * We prefer the pin coordinates when available.
 */
export function extractMapInfo(
  url: string
): { lat: number; lng: number; zoom: number } | null {
  const pinMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  const viewMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)(?:,(\d+(?:\.\d+)?)z)?/);

  const lat = pinMatch ? parseFloat(pinMatch[1]) : viewMatch ? parseFloat(viewMatch[1]) : null;
  const lng = pinMatch ? parseFloat(pinMatch[2]) : viewMatch ? parseFloat(viewMatch[2]) : null;
  const zoom = viewMatch?.[3] ? Math.round(parseFloat(viewMatch[3])) : 17;

  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng, zoom };
}

/**
 * Build a proper Google Maps embed URL (pb format) that shows a clean single
 * pin at the given coordinates — no search panel, no ambiguous results.
 *
 * pb field layout (all nested token counts verified against real embed URLs):
 *   !1m18  — outer section, 18 total tokens
 *     !1m12  — view/camera/viewport, 12 tokens
 *       !1m3 !1d{D} !2d{lng} !3d{lat}   view centre + diameter
 *       !2m3 !1f0 !2f0 !3f0             camera heading/tilt/roll
 *       !3m2 !1i1024 !2i768             viewport size
 *       !4f13.1                          zoom factor
 *     !3m3  — place marker, 3 tokens
 *       !1m2 !1s !2s                     (empty place ID/name → dropped pin)
 *   !5e0                                 map type: roadmap
 *   !3m2 !1sen !2sbd                     locale
 *   !4v{ts}                              version/timestamp
 *   !8m2 !3d{lat} !4d{lng}              pin position
 */
export function buildPbEmbedUrl(lat: number, lng: number, zoom = 17): string {
  // View diameter in metres, calibrated to zoom 17 for Bangladesh latitudes.
  // Doubles for each zoom step out, halves for each step in.
  const d = Math.round(3648.4 * Math.pow(2, 17 - zoom) * 10) / 10;
  const ts = Date.now();

  const pb =
    `!1m18!1m12!1m3!1d${d}!2d${lng}!3d${lat}` +
    `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1` +
    `!3m3!1m2!1s!2s!5e0!3m2!1sen!2sbd!4v${ts}` +
    `!8m2!3d${lat}!4d${lng}`;

  return `https://www.google.com/maps/embed?pb=${pb}`;
}
