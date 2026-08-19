'use client';

type SignResponse = {
  provider: 'supabase' | 'cloudinary';
  // supabase
  signedUrl?: string;
  url?: string;
  // cloudinary
  cloudName?: string;
  apiKey?: string;
  timestamp?: number;
  signature?: string;
  folder?: string;
  error?: string;
};

type UploadOptions = {
  /** The legacy proxy endpoint a caller configured; "/sign" is appended to it. */
  endpoint?: string;
  folder?: string;
  onProgress?: (percent: number) => void;
};

/**
 * Sends the file straight from the browser to the storage provider, using a
 * short-lived credential minted by our own API.
 *
 * The bytes never pass through a serverless function, which is what keeps large
 * files (PDF catalogues, high-resolution photos) from hitting Vercel's 4.5MB
 * request-body limit and failing with a 413.
 */
export async function uploadFile(file: File, options: UploadOptions = {}): Promise<string> {
  const base = options.endpoint || '/api/admin/upload';

  const signResponse = await fetch(`${base}/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
      folder: options.folder,
    }),
  });

  const signed: SignResponse | null = await signResponse.json().catch(() => null);

  if (!signResponse.ok || !signed) {
    throw new Error(signed?.error || `Could not start upload (${signResponse.status})`);
  }

  if (signed.provider === 'supabase') {
    if (!signed.signedUrl || !signed.url) {
      throw new Error('Upload was not signed correctly. Please try again.');
    }

    // Mirrors what supabase-js sends for a Blob body: multipart with the file
    // under an empty field name.
    const body = new FormData();
    body.append('cacheControl', '3600');
    body.append('', file);

    await sendWithProgress('PUT', signed.signedUrl, body, options.onProgress);
    return signed.url;
  }

  if (!signed.cloudName || !signed.apiKey || !signed.signature || !signed.timestamp) {
    throw new Error('Upload was not signed correctly. Please try again.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('api_key', signed.apiKey);
  body.append('timestamp', String(signed.timestamp));
  body.append('signature', signed.signature);
  if (signed.folder) {
    body.append('folder', signed.folder);
  }

  const result = await sendWithProgress(
    'POST',
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`,
    body,
    options.onProgress
  );

  const parsed = JSON.parse(result) as { secure_url?: string };

  if (!parsed.secure_url) {
    throw new Error('Upload succeeded but no file URL was returned.');
  }

  return parsed.secure_url;
}

/**
 * XHR rather than fetch: only XHR reports upload progress, which matters when
 * an admin is pushing a 25MB PDF over a slow connection.
 */
function sendWithProgress(
  method: 'PUT' | 'POST',
  url: string,
  body: FormData,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.upload.addEventListener('progress', (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
        return;
      }
      reject(new Error(describeFailure(xhr.status, xhr.responseText)));
    });

    xhr.addEventListener('error', () =>
      reject(new Error('Network error while uploading. Please check your connection.'))
    );
    xhr.addEventListener('abort', () => reject(new Error('Upload was cancelled.')));

    xhr.send(body);
  });
}

function describeFailure(status: number, responseText: string): string {
  try {
    const parsed = JSON.parse(responseText);
    const message = parsed?.error?.message || parsed?.message || parsed?.error;
    if (typeof message === 'string' && message) {
      return message;
    }
  } catch {
    // Non-JSON provider error; fall through to the generic message.
  }

  if (status === 413) {
    return 'The storage provider rejected this file as too large.';
  }

  return `Upload failed (${status}).`;
}
