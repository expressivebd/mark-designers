'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import UploadField from './UploadField';
import ConfirmDialog from './ConfirmDialog';

type ClientItem = {
  id: string;
  name: string;
  logoUrl: string;
};

type ClientStats = {
  totalClients: number;
  countriesServed: string;
  yearsServed: string;
  satisfactionPercentage: string;
};

type ClientGetResponse = {
  items: ClientItem[];
  stats: ClientStats;
};

type FormState = {
  name: string;
  logoUrl: string;
};

const emptyForm: FormState = {
  name: '',
  logoUrl: '',
};

const emptyStats: ClientStats = {
  totalClients: 0,
  countriesServed: '',
  yearsServed: '',
  satisfactionPercentage: '',
};

export default function ClientManager() {
  const [items, setItems] = useState<ClientItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [stats, setStats] = useState<ClientStats>(emptyStats);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const totalClients = useMemo(() => items.length, [items.length]);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/clients');
      if (!response.ok) {
        throw new Error('Failed to load clients');
      }

      const data = (await response.json()) as ClientGetResponse;
      setItems(data.items || []);
      setStats({
        totalClients: Number(data?.stats?.totalClients || 0),
        countriesServed: String(data?.stats?.countriesServed || ''),
        yearsServed: String(data?.stats?.yearsServed || ''),
        satisfactionPercentage: String(data?.stats?.satisfactionPercentage || ''),
      });
    } catch {
      setError('Failed to load clients.');
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

    const response = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError('Failed to create client.');
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

    const response = await fetch('/api/admin/clients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    });

    if (!response.ok) {
      setError('Failed to update client.');
      return;
    }

    setEditId(null);
    setEditForm(emptyForm);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch('/api/admin/clients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setError('Failed to delete client.');
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

  const handleSaveStats = async () => {
    const response = await fetch('/api/admin/clients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateStats',
        countriesServed: stats.countriesServed,
        yearsServed: stats.yearsServed,
        satisfactionPercentage: stats.satisfactionPercentage,
      }),
    });

    if (!response.ok) {
      setError('Failed to save client stats.');
      return;
    }

    loadItems();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-playfair font-semibold text-primary">Add Client</h2>
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
            folder="clients"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(url) => setForm((prev) => ({ ...prev, logoUrl: url }))}
          />
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="mt-4 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Create Client
        </button>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-primary">Total Number Of Client</label>
            <input
              type="text"
              value={String(totalClients)}
              readOnly
              className="w-full rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-primary">Total Countries Served</label>
            <input
              type="text"
              value={stats.countriesServed}
              onChange={(event) => setStats((prev) => ({ ...prev, countriesServed: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-primary">Years Served</label>
            <input
              type="text"
              value={stats.yearsServed}
              onChange={(event) => setStats((prev) => ({ ...prev, yearsServed: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-primary">Client Satisfaction Percentage</label>
            <input
              type="text"
              value={stats.satisfactionPercentage}
              onChange={(event) =>
                setStats((prev) => ({ ...prev, satisfactionPercentage: event.target.value }))
              }
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveStats}
          className="mt-4 rounded-sm border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
        >
          Save Client Stats
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-playfair font-semibold text-primary">Existing Clients</h2>

        {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
        {!isLoading && items.length === 0 && <p className="text-sm text-gray-600">No clients yet.</p>}

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
                    folder="clients"
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
        title="Delete Client"
        message="Are you sure you want to delete this client?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
