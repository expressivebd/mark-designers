'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import UploadField from './UploadField';

type CertificationItem = {
  id: string;
  name: string;
  logoUrl: string;
};

type FormState = {
  name: string;
  logoUrl: string;
};

const emptyForm: FormState = {
  name: '',
  logoUrl: '',
};

export default function CertificationManager() {
  const [items, setItems] = useState<CertificationItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/certifications');
      if (!response.ok) {
        throw new Error('Failed to load certifications');
      }
      const data = (await response.json()) as CertificationItem[];
      setItems(data || []);
    } catch {
      setError('Failed to load certifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.logoUrl.trim()) {
      setError('Name and logo are required.');
      return;
    }

    const response = await fetch('/api/admin/certifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError('Failed to create certification.');
      return;
    }

    setForm(emptyForm);
    loadItems();
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim() || !editForm.logoUrl.trim()) {
      setError('Name and logo are required.');
      return;
    }

    const response = await fetch('/api/admin/certifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    });

    if (!response.ok) {
      setError('Failed to update certification.');
      return;
    }

    setEditId(null);
    setEditForm(emptyForm);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    const response = await fetch('/api/admin/certifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setError('Failed to delete certification.');
      return;
    }

    loadItems();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-playfair font-semibold text-primary">Add Certification</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <UploadField
            label="Logo"
            value={form.logoUrl}
            folder="certifications"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(url) => setForm((prev) => ({ ...prev, logoUrl: url }))}
          />
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="mt-4 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Create Certification
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-playfair font-semibold text-primary">Existing Certifications</h2>

        {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
        {!isLoading && items.length === 0 && <p className="text-sm text-gray-600">No certifications yet.</p>}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-slate-200 p-3">
              {editId === item.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                  />
                  <UploadField
                    label=""
                    value={editForm.logoUrl}
                    folder="certifications"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={(url) => setEditForm((prev) => ({ ...prev, logoUrl: url }))}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id)}
                      className="flex-1 rounded-sm bg-primary px-3 py-2 text-xs font-medium text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setEditForm(emptyForm);
                      }}
                      className="flex-1 rounded-sm border border-slate-200 px-3 py-2 text-xs font-medium text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative mx-auto h-20 w-full max-w-[180px] overflow-hidden rounded bg-slate-50">
                    <Image src={item.logoUrl} alt={item.name} fill className="object-contain" sizes="180px" />
                  </div>
                  <p className="text-center text-sm font-medium text-primary">{item.name}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(item.id);
                        setEditForm({ name: item.name, logoUrl: item.logoUrl });
                      }}
                      className="flex-1 rounded-sm border border-slate-200 px-3 py-2 text-xs font-medium text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 rounded-sm border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
