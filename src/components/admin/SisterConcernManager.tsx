'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import UploadField from './UploadField';
import ConfirmDialog from './ConfirmDialog';

type SisterConcernForm = {
  name: string;
  tagline: string;
  thumbnailUrl: string;
  description: string;
  establishedYear: string;
  location: string;
  capacity: string;
  personnel: string;
  totalMachines: string;
  factoryPhotos: string[];
  link: string;
};

type SisterConcernItem = SisterConcernForm & {
  id: string;
  slug: string;
  yearsInOperation: number;
};

const currentYear = new Date().getFullYear();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function emptyForm(): SisterConcernForm {
  return {
    name: '',
    tagline: '',
    thumbnailUrl: '',
    description: '',
    establishedYear: '',
    location: '',
    capacity: '',
    personnel: '',
    totalMachines: '',
    factoryPhotos: [],
    link: '',
  };
}

function getYearsInOperation(establishedYear: string) {
  const parsed = Number(establishedYear);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > currentYear) {
    return 0;
  }
  return currentYear - parsed;
}

export default function SisterConcernManager() {
  const [items, setItems] = useState<SisterConcernItem[]>([]);
  const [form, setForm] = useState<SisterConcernForm>(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SisterConcernForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Temp upload state for factory photos (separate for create vs edit forms)
  const [formPhotoKey, setFormPhotoKey] = useState(0);
  const [editPhotoKey, setEditPhotoKey] = useState(0);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/sister-concerns');
      if (!response.ok) {
        throw new Error('Failed to load sister concerns');
      }

      const data = (await response.json()) as SisterConcernItem[];
      setItems(data || []);
    } catch {
      setError('Failed to load sister concerns.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const formSlug = useMemo(() => slugify(form.name), [form.name]);
  const formLink = formSlug ? `/sister-concerns/${formSlug}` : '/sister-concerns';
  const formYearsInOperation = useMemo(
    () => getYearsInOperation(form.establishedYear),
    [form.establishedYear]
  );

  const editSlug = useMemo(() => slugify(editForm.name), [editForm.name]);
  const editLink = editSlug ? `/sister-concerns/${editSlug}` : '/sister-concerns';
  const editYearsInOperation = useMemo(
    () => getYearsInOperation(editForm.establishedYear),
    [editForm.establishedYear]
  );

  const handleCreate = async () => {
    setError('');

    const response = await fetch('/api/admin/sister-concerns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError('Failed to create sister concern.');
      return;
    }

    setForm(emptyForm());
    setFormPhotoKey((k) => k + 1);
    fetchItems();
  };

  const handleUpdate = async () => {
    if (!editId) {
      return;
    }

    setError('');

    const response = await fetch('/api/admin/sister-concerns', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, ...editForm }),
    });

    if (!response.ok) {
      setError('Failed to update sister concern.');
      return;
    }

    setEditId(null);
    setEditForm(emptyForm());
    setEditPhotoKey((k) => k + 1);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    setError('');

    const response = await fetch('/api/admin/sister-concerns', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setError('Failed to delete sister concern.');
      return;
    }

    fetchItems();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const renderFactoryPhotoEditor = (
    photos: string[],
    onChange: (next: string[]) => void,
    folderSuffix: string,
    uploadKey: number,
    onUploadKeyReset: () => void
  ) => {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-primary">Factory Photos</label>

        {/* Always-visible upload field — auto-adds on successful upload */}
        <div key={uploadKey}>
          <UploadField
            label="Add Factory Photo"
            value=""
            folder={`sister-concerns/${folderSuffix}`}
            accept="image/*"
            onChange={(url) => {
              if (url) {
                onChange([...photos, url]);
                onUploadKeyReset();
              }
            }}
          />
        </div>

        {/* Uploaded photos grid */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {photos.map((photo, index) => (
              <div key={`${photo}-${index}`} className="relative">
                <div className="relative h-24 w-24 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  <Image
                    src={photo}
                    alt={`Factory photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onChange(photos.filter((_, i) => i !== index))}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition-colors"
                  title="Remove photo"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBaseFields = (
    values: SisterConcernForm,
    setValues: (updater: (prev: SisterConcernForm) => SisterConcernForm) => void,
    slug: string,
    link: string,
    yearsInOperation: number,
    folderSuffix: string,
    photoUploadKey: number,
    onPhotoKeyReset: () => void
  ) => {
    return (
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Name</label>
          <input
            type="text"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Tagline</label>
          <input
            type="text"
            value={values.tagline}
            onChange={(event) => setValues((prev) => ({ ...prev, tagline: event.target.value }))}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <UploadField
          label="Thumbnail Photo"
          value={values.thumbnailUrl}
          folder={`sister-concerns/${folderSuffix}`}
          accept="image/*"
          onChange={(url) => setValues((prev) => ({ ...prev, thumbnailUrl: url }))}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Description</label>
          <textarea
            value={values.description}
            onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            rows={4}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Established Year</label>
            <input
              type="number"
              value={values.establishedYear}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, establishedYear: event.target.value }))
              }
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Years in Operation</label>
            <input
              type="text"
              value={yearsInOperation > 0 ? String(yearsInOperation) : '-'}
              disabled
              className="w-full rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Location</label>
          <input
            type="text"
            value={values.location}
            onChange={(event) => setValues((prev) => ({ ...prev, location: event.target.value }))}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Capacity</label>
            <input
              type="text"
              value={values.capacity}
              onChange={(event) => setValues((prev) => ({ ...prev, capacity: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Personnel</label>
            <input
              type="text"
              value={values.personnel}
              onChange={(event) => setValues((prev) => ({ ...prev, personnel: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Total Machines</label>
          <input
            type="text"
            value={values.totalMachines}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, totalMachines: event.target.value }))
            }
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Slug</label>
            <input
              type="text"
              value={slug || '-'}
              disabled
              className="w-full rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Auto Link</label>
            <input
              type="text"
              value={link}
              disabled
              className="w-full rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Custom Link (optional)</label>
          <input
            type="text"
            value={values.link}
            placeholder="e.g. /sister-concerns/my-facility or https://example.com"
            onChange={(event) => setValues((prev) => ({ ...prev, link: event.target.value }))}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
          <p className="text-xs text-slate-500">If left empty, the Auto Link above will be used.</p>
        </div>

        {renderFactoryPhotoEditor(
          values.factoryPhotos,
          (next) => setValues((prev) => ({ ...prev, factoryPhotos: next })),
          folderSuffix,
          photoUploadKey,
          onPhotoKeyReset
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Add Sister Concern</h2>
        {renderBaseFields(
          form,
          (updater) => setForm((prev) => updater(prev)),
          formSlug,
          formLink,
          formYearsInOperation,
          formSlug || 'new',
          formPhotoKey,
          () => setFormPhotoKey((k) => k + 1)
        )}
        <button
          type="button"
          onClick={handleCreate}
          className="mt-4 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Create Sister Concern
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Existing Sister Concerns</h2>
        {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
        {!isLoading && items.length === 0 && <p className="text-sm text-gray-600">No items yet.</p>}

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-slate-100 p-4">
              {editId === item.id ? (
                <div className="space-y-4">
                  {renderBaseFields(
                    editForm,
                    (updater) => setEditForm((prev) => updater(prev)),
                    editSlug,
                    editLink,
                    editYearsInOperation,
                    editSlug || 'edit',
                    editPhotoKey,
                    () => setEditPhotoKey((k) => k + 1)
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setEditForm(emptyForm());
                        setEditPhotoKey((k) => k + 1);
                      }}
                      className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                    <div>
                      <span className="font-medium text-primary">Name:</span> {item.name || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Tagline:</span> {item.tagline || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Link:</span> {item.link || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Established:</span> {item.establishedYear || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Years in Operation:</span>{' '}
                      {item.yearsInOperation || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Location:</span> {item.location || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Capacity:</span> {item.capacity || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Personnel:</span> {item.personnel || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-primary">Total Machines:</span> {item.totalMachines || '-'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-primary">Thumbnail:</span>{' '}
                      <span className="break-all">{item.thumbnailUrl || '-'}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-primary">Factory Photos:</span>{' '}
                      {item.factoryPhotos?.length || 0}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(item.id);
                        setEditForm({
                          name: item.name || '',
                          tagline: item.tagline || '',
                          thumbnailUrl: item.thumbnailUrl || '',
                          description: item.description || '',
                          establishedYear: item.establishedYear || '',
                          location: item.location || '',
                          capacity: item.capacity || '',
                          personnel: item.personnel || '',
                          totalMachines: item.totalMachines || '',
                          factoryPhotos: item.factoryPhotos || [],
                          link: item.link || '',
                        });
                      }}
                      className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary hover:border-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                      className="rounded-sm border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:border-red-400"
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
        isOpen={Boolean(deleteTarget)}
        title="Delete Sister Concern"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this sister concern'}?`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
