'use client';

import { useEffect, useState } from 'react';
import UploadField from './UploadField';

type SiteContentsForm = {
  catalogUrl: string;
  companyProfileUrl: string;
};

function emptyForm(): SiteContentsForm {
  return { catalogUrl: '', companyProfileUrl: '' };
}

export default function SiteContentsManager() {
  const [form, setForm] = useState<SiteContentsForm>(emptyForm());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/site-contents');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setForm({
              catalogUrl: data.catalogUrl || '',
              companyProfileUrl: data.companyProfileUrl || '',
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('');

    const response = await fetch('/api/admin/site-contents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setIsSaving(false);
    setStatus(response.ok ? 'Saved successfully.' : 'Failed to save changes.');
  };

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Catalog</h2>
        <p className="text-sm text-gray-600 mb-4">
          PDF served by the &quot;Catalog&quot; button in the site navbar.
        </p>
        <UploadField
          label="Catalog PDF (Max 25MB)"
          value={form.catalogUrl}
          folder="site-contents"
          accept="application/pdf"
          endpoint="/api/admin/upload-document"
          maxSizeMb={25}
          onChange={(url) => setForm((prev) => ({ ...prev, catalogUrl: url }))}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Company Profile</h2>
        <p className="text-sm text-gray-600 mb-4">
          PDF served by the &quot;Company Profile&quot; button in the site navbar. This is the
          overall company profile, separate from individual sister concern profiles.
        </p>
        <UploadField
          label="Company Profile PDF (Max 25MB)"
          value={form.companyProfileUrl}
          folder="site-contents"
          accept="application/pdf"
          endpoint="/api/admin/upload-document"
          maxSizeMb={25}
          onChange={(url) => setForm((prev) => ({ ...prev, companyProfileUrl: url }))}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-sm bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          {isSaving ? 'Saving...' : 'Save Contents'}
        </button>
        {status && <span className="text-sm text-primary">{status}</span>}
      </div>
    </div>
  );
}
