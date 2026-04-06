'use client';

import { useCallback, useEffect, useState } from 'react';
import UploadField from './UploadField';

type FieldType = 'text' | 'textarea' | 'image' | 'date';

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
};

type CollectionManagerProps = {
  title: string;
  endpoint: string;
  fields: FieldConfig[];
  folder?: string;
};

type ItemRecord = Record<string, string> & { id: string };

const CollectionManager = ({ title, endpoint, fields, folder }: CollectionManagerProps) => {
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to load items');
      }
      const data = await response.json();
      setItems(data || []);
    } catch (err) {
      setError('Failed to load items.');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async () => {
    setError('');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError('Failed to create item.');
      return;
    }

    setForm({});
    fetchItems();
  };

  const handleUpdate = async (id: string) => {
    setError('');
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    });

    if (!response.ok) {
      setError('Failed to update item.');
      return;
    }

    setEditId(null);
    setEditForm({});
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    setError('');
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setError('Failed to delete item.');
      return;
    }

    fetchItems();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Add {title}</h2>
        <div className="grid gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              {field.type === 'image' ? (
                <UploadField
                  label={field.label}
                  value={form[field.name] || ''}
                  folder={folder}
                  accept="image/*"
                  onChange={(url) => setForm((prev) => ({ ...prev, [field.name]: url }))}
                />
              ) : field.type === 'textarea' ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-primary">{field.label}</label>
                  <textarea
                    value={form[field.name] || ''}
                    placeholder={field.placeholder}
                    onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                    className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-primary">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.name] || ''}
                    placeholder={field.placeholder}
                    onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                    className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="mt-4 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Create {title}
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Existing {title}</h2>
        {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
        {!isLoading && items.length === 0 && (
          <p className="text-sm text-gray-600">No items yet.</p>
        )}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-slate-100 p-4">
              {editId === item.id ? (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.name}>
                      {field.type === 'image' ? (
                        <UploadField
                          label={field.label}
                          value={editForm[field.name] || ''}
                          folder={folder}
                          accept="image/*"
                          onChange={(url) => setEditForm((prev) => ({ ...prev, [field.name]: url }))}
                        />
                      ) : field.type === 'textarea' ? (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-primary">{field.label}</label>
                          <textarea
                            value={editForm[field.name] || ''}
                            onChange={(event) =>
                              setEditForm((prev) => ({ ...prev, [field.name]: event.target.value }))
                            }
                            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                            rows={3}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-primary">{field.label}</label>
                          <input
                            type={field.type}
                            value={editForm[field.name] || ''}
                            onChange={(event) =>
                              setEditForm((prev) => ({ ...prev, [field.name]: event.target.value }))
                            }
                            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id)}
                      className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setEditForm({});
                      }}
                      className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="grid gap-2 text-sm text-gray-700">
                    {fields.map((field) => (
                      <div key={field.name}>
                        <span className="font-medium text-primary">{field.label}:</span>{' '}
                        <span className="break-all">{item[field.name] || '-'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(item.id);
                        setEditForm(item);
                      }}
                      className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary hover:border-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
};

export default CollectionManager;
