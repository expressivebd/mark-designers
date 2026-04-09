'use client';

import { useState } from 'react';

type UploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
};

const UploadField = ({ label, value, onChange, folder, accept }: UploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept={accept || '.jpg,.jpeg,.png,image/jpeg,image/png'}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              handleUpload(file);
            }
          }}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-sm file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white file:font-medium hover:file:bg-accent-dark"
        />
        {isUploading && <span className="text-sm text-accent">Uploading...</span>}
      </div>
      {value && (
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
