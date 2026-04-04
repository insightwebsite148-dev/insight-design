/**
 * Converts a regular Google Maps URL to an embeddable one.
 * Supports:
 *  - Already-embed URLs (returned as-is)
 *  - google.com/maps/place/... URLs (converted to embed/v1/place)
 *  - google.com/maps?q=... or @lat,lng URLs
 *
 * Returns null if the URL can't be converted or isn't a Google Maps URL.
 */
export function toEmbedUrl(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const url = raw.trim();
  if (!url) return null;

  // Already an embed URL — use as-is
  if (url.includes('/maps/embed')) return url;

  // Extract coordinates from the URL (e.g. @30.0017448,31.5085857)
  const coordsMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);

  // google.com/maps/place/... URL
  if (url.includes('google.com/maps/place/')) {
    // Extract the place name from the URL path
    const placeMatch = url.match(/\/maps\/place\/([^/@?]+)/);
    const placeName = placeMatch ? decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ') : '';

    if (coordsMatch) {
      const lat = coordsMatch[1];
      const lng = coordsMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg`;
    }
    if (placeName) {
      return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(placeName)}`;
    }
  }

  // Simple coordinates URL
  if (coordsMatch) {
    const lat = coordsMatch[1];
    const lng = coordsMatch[2];
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg`;
  }

  // URL with ?q= parameter
  const qMatch = url.match(/[?&]q=([^&]+)/);
  if (qMatch) {
    const query = qMatch[1];
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0&q=${query}`;
  }

  // Not a recognized Google Maps URL
  return null;
}
