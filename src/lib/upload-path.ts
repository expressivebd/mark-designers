// Builds the storage object path for an uploaded file. Kept in one place so the
// signing routes and the legacy proxy routes name files identically.
export function buildUploadPath(originalName: string, folder: string): string {
  const name = originalName || 'file';
  const extMatch = name.match(/\.[a-zA-Z0-9]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : '';
  const base =
    name
      .replace(/\.[a-zA-Z0-9]+$/, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .slice(0, 60) || 'file';

  return `${folder}/${base}-${Date.now().toString(36)}${ext}`;
}

export const MAX_DOCUMENT_SIZE_BYTES = 25 * 1024 * 1024;
