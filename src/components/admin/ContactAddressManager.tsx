'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

type ContactAddressItem = {
  id: string;
  title: string;
  fullAddress: string;
  phones: string[];
  emails: string[];
  mapLocation: string;
  mapEmbedUrl: string;
  directionUrl: string;
};

type ContactAddressForm = {
  title: string;
  fullAddress: string;
  phones: string[];
  emails: string[];
  mapLocation: string;
};

const emptyForm = (): ContactAddressForm => ({
  title: '',
  fullAddress: '',
  phones: [''],
  emails: [''],
  mapLocation: '',
});

function normalizePhones(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

function normalizeEmails(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

function isGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.hostname === 'maps.app.goo.gl' ||
      url.hostname === 'goo.gl' ||
      (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) ||
      (url.hostname === 'google.com' && url.pathname.startsWith('/maps'))
    );
  } catch {
    return false;
  }
}

function buildEmbedUrl(location: string) {
  const query = location.trim();
  if (!query || isGoogleMapsUrl(query)) return ''; // Google Maps URLs can't be embedded directly
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function buildDirectionUrl(location: string) {
  const query = location.trim();
  if (!query) return '';
  if (isGoogleMapsUrl(query)) return query; // share link works for directions
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}


export default function ContactAddressManager() {
  const [items, setItems] = useState<ContactAddressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactAddressForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<ContactAddressItem | null>(null);
  // Resolved embed URLs for the form preview
  const [previewEmbed, setPreviewEmbed] = useState<{ embedUrl: string; directionUrl: string } | null>(null);
  const [isResolvingPreview, setIsResolvingPreview] = useState(false);

  const formMapLocation = useMemo(() => form.mapLocation || form.fullAddress, [form.mapLocation, form.fullAddress]);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/contact');
      if (!response.ok) {
        throw new Error('Failed to load contact addresses');
      }

      const data = (await response.json()) as ContactAddressItem[];
      setItems(data || []);
    } catch {
      setError('Failed to load contact addresses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Resolve Google Maps URLs for live preview whenever the location field changes
  useEffect(() => {
    const addr = form.fullAddress.trim() || form.mapLocation.trim();
    const mapsUrl = form.mapLocation.trim();

    // Embed: use plain-text address for reliable geocoding
    const addrForEmbed = form.fullAddress.trim() || (!isGoogleMapsUrl(mapsUrl) ? mapsUrl : '');
    const embedUrl = addrForEmbed
      ? buildEmbedUrl(addrForEmbed)
      : '';

    // Direction: share link (or address fallback)
    const directionUrl = mapsUrl && isGoogleMapsUrl(mapsUrl)
      ? mapsUrl
      : addr
      ? buildDirectionUrl(addr)
      : '';

    if (embedUrl || directionUrl) {
      setPreviewEmbed({ embedUrl, directionUrl });
    } else {
      setPreviewEmbed(null);
    }
    setIsResolvingPreview(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.fullAddress, form.mapLocation]);

  const openCreateForm = () => {
    setEditId(null);
    setForm(emptyForm());
    setIsFormOpen(true);
    setStatus('');
    setError('');
  };

  const openEditForm = (item: ContactAddressItem) => {
    setEditId(item.id);
    setForm({
      title: item.title || '',
      fullAddress: item.fullAddress || '',
      phones: item.phones.length > 0 ? item.phones : [''],
      emails: item.emails.length > 0 ? item.emails : [''],
      mapLocation: item.mapLocation || '',
    });
    setIsFormOpen(true);
    setStatus('');
    setError('');
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditId(null);
    setForm(emptyForm());
  };

  const updatePhone = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.phones];
      next[index] = value;
      return { ...prev, phones: next };
    });
  };

  const updateEmail = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.emails];
      next[index] = value;
      return { ...prev, emails: next };
    });
  };

  const addPhone = () => {
    setForm((prev) => ({ ...prev, phones: [...prev.phones, ''] }));
  };

  const addEmail = () => {
    setForm((prev) => ({ ...prev, emails: [...prev.emails, ''] }));
  };

  const removePhone = (index: number) => {
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removeEmail = (index: number) => {
    setForm((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const saveAddress = async () => {
    const payload = {
      title: form.title.trim(),
      fullAddress: form.fullAddress.trim(),
      phones: normalizePhones(form.phones),
      emails: normalizeEmails(form.emails),
      mapLocation: formMapLocation.trim(),
    };

    if (!payload.title || !payload.fullAddress || !payload.mapLocation) {
      setError('Title, full address, and map location are required.');
      return;
    }

    const response = await fetch('/api/admin/contact', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editId ? { id: editId, ...payload } : payload),
    });

    if (!response.ok) {
      setError(editId ? 'Failed to update address.' : 'Failed to save address.');
      return;
    }

    setStatus(editId ? 'Address updated successfully.' : 'Address saved successfully.');
    closeForm();
    loadItems();
  };

  const requestDelete = (item: ContactAddressItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    const response = await fetch('/api/admin/contact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteTarget.id }),
    });

    if (!response.ok) {
      setError('Failed to delete address.');
      return;
    }

    setDeleteTarget(null);
    setStatus('Address deleted successfully.');
    loadItems();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-playfair font-semibold text-primary">Contact Addresses</h2>
          <p className="text-sm text-gray-600">Manage office and facility contact cards for the frontend contact page.</p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Add New Address
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
        {!isLoading && items.length === 0 && <p className="text-sm text-gray-600">No contact addresses yet.</p>}

        <div className="grid gap-4">
          {items.map((item, index) => (
            <div key={item.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-sm font-semibold tracking-wider text-accent">{index % 2 === 0 ? 'ODD' : 'EVEN'} SECTION</p>
                    <h3 className="text-2xl font-playfair font-bold text-primary">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.fullAddress}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Phones</p>
                      <ul className="mt-1 space-y-1 text-sm text-gray-600">
                        {item.phones.map((phone, phoneIndex) => (
                          <li key={`${item.id}-phone-${phoneIndex}`}>{phone}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Emails</p>
                      <ul className="mt-1 space-y-1 text-sm text-gray-600">
                        {item.emails.map((email, emailIndex) => (
                          <li key={`${item.id}-email-${emailIndex}`}>{email}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-primary hover:border-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDelete(item)}
                      className="rounded-sm border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:border-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-[420px]">
                  {item.mapEmbedUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                      <div className="relative h-56 w-full bg-slate-100">
                        <iframe
                          src={item.mapEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={item.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center text-slate-500">
                      Map preview will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {status && <p className="text-sm text-primary">{status}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-playfair font-semibold text-primary">
                  {editId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Fill in the address details and map location.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-primary"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-primary">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-primary">Full Address</label>
                <textarea
                  value={form.fullAddress}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullAddress: event.target.value }))}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                  rows={4}
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-sm font-medium text-primary">Phone Numbers</label>
                  <button type="button" onClick={addPhone} className="text-sm font-medium text-accent">
                    Add another phone number
                  </button>
                </div>
                <div className="space-y-3">
                  {form.phones.map((phone, index) => (
                    <div key={`phone-${index}`} className="flex gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(event) => updatePhone(index, event.target.value)}
                        className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                        placeholder={`Phone number ${index + 1}`}
                      />
                      {form.phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhone(index)}
                          className="rounded-sm border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-sm font-medium text-primary">Emails</label>
                  <button type="button" onClick={addEmail} className="text-sm font-medium text-accent">
                    Add another email
                  </button>
                </div>
                <div className="space-y-3">
                  {form.emails.map((email, index) => (
                    <div key={`email-${index}`} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => updateEmail(index, event.target.value)}
                        className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                        placeholder={`Email ${index + 1}`}
                      />
                      {form.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="rounded-sm border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-primary">Map Location</label>
                <textarea
                  value={form.mapLocation}
                  onChange={(event) => setForm((prev) => ({ ...prev, mapLocation: event.target.value }))}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Paste a Google Maps share link (e.g. https://maps.app.goo.gl/...) or enter a place name / address"
                />
                <p className="text-xs text-gray-500">You can paste a Google Maps short link (maps.app.goo.gl), a full Google Maps URL, or just type a place name or address.</p>
              </div>

              {formMapLocation && (
                <div className="md:col-span-2 rounded-lg border border-slate-200 p-4 space-y-3">
                  <p className="text-sm font-semibold text-primary">Map Preview</p>
                  <div className="relative h-64 w-full overflow-hidden rounded-md bg-slate-100">
                    {isResolvingPreview && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100">
                        <span className="text-sm text-gray-500 animate-pulse">Resolving map location…</span>
                      </div>
                    )}
                    {previewEmbed?.embedUrl && !isResolvingPreview && (
                      <iframe
                        src={previewEmbed.embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Map preview"
                      />
                    )}
                    {!previewEmbed?.embedUrl && !isResolvingPreview && (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                        Could not load map preview. Check the URL and try again.
                      </div>
                    )}
                  </div>
                  {previewEmbed?.directionUrl && (
                    <a
                      href={previewEmbed.directionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                    >
                      Open direction link
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAddress}
                className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Contact Address"
        message={`Are you sure you want to delete ${deleteTarget?.title || 'this address'}?`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
