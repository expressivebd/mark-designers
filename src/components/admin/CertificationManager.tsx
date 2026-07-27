'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import UploadField from './UploadField';
import ConfirmDialog from './ConfirmDialog';

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

const COLLAPSED_ROW_COUNT = 4;

export default function CertificationManager() {
  const [items, setItems] = useState<CertificationItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

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

  const requestDelete = (id: string) => {
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    await handleDelete(deleteId);
    setDeleteId(null);
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-playfair font-semibold text-primary">Existing Certifications</h2>
          {items.length > COLLAPSED_ROW_COUNT && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-medium text-primary hover:bg-slate-50"
            >
              {isExpanded ? 'Collapse' : `Show All (${items.length})`}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
        {!isLoading && items.length === 0 && <p className="text-sm text-gray-600">No certifications yet.</p>}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {(isExpanded ? items : items.slice(0, COLLAPSED_ROW_COUNT)).map((item) => (
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
                      onClick={() => requestDelete(item.id)}
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

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Certification"
        message="Are you sure you want to delete this certification?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
