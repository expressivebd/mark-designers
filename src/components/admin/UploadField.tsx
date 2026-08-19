'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadFile } from '@/lib/upload-client';

type UploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  endpoint?: string;
  maxSizeMb?: number;
};

const UploadField = ({ label, value, onChange, folder, accept, endpoint, maxSizeMb }: UploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const normalizedAccept = accept || '.jpg,.jpeg,.png,image/jpeg,image/png';
  const imageAccept = normalizedAccept.includes('image');
  const hasImageValue =
    imageAccept &&
    Boolean(value) &&
    (/\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)(\?|$)/i.test(value) || value.includes('/image/'));

  const handleUpload = async (file: File) => {
    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMb}MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError('');

    try {
      // Uploads browser -> storage provider directly. Routing the bytes through
      // our own API would cap them at Vercel's 4.5MB request-body limit.
      const url = await uploadFile(file, {
        endpoint,
        folder,
        onProgress: setProgress,
      });

      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept={normalizedAccept}
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Clear the input so re-picking the same file after a failed upload
            // still fires a change event.
            event.target.value = '';
            if (file) {
              handleUpload(file);
            }
          }}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-sm file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white file:font-medium hover:file:bg-accent-dark"
        />
        {isUploading && (
          <span className="whitespace-nowrap text-sm text-accent">
            {progress > 0 ? `Uploading ${progress}%` : 'Uploading...'}
          </span>
        )}
      </div>

      {hasImageValue && (
        <div className="relative h-20 w-28 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
          <Image
            src={value}
            alt={label || 'Uploaded image'}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
      )}

      {!imageAccept && value && (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default UploadField;
