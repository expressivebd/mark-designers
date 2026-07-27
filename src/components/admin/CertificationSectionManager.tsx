'use client';

import { useCallback, useEffect, useState } from 'react';
import RichTextEditor from './RichTextEditor';
import ConfirmDialog from './ConfirmDialog';

type SectionItem = {
  id: string;
  heading: string;
  description: string;
};

type FormState = {
  heading: string;
  description: string;
};

const emptyForm: FormState = {
  heading: '',
  description: '',
};

export default function CertificationSectionManager() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [addFormKey, setAddFormKey] = useState(0);

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadSections = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/certification-sections');
      if (!response.ok) {
        throw new Error('Failed to load sections');
      }
      const data = (await response.json()) as SectionItem[];
      setSections(data || []);
    } catch {
      setError('Failed to load certification sections.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const handleCreate = async () => {
    if (!form.heading.trim()) {
      setError('Heading is required.');
      return;
    }

    const response = await fetch('/api/admin/certification-sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError('Failed to create section.');
      return;
    }

    setForm(emptyForm);
    setAddFormKey((prev) => prev + 1);
    setShowAddForm(false);
    loadSections();
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.heading.trim()) {
      setError('Heading is required.');
      return;
    }

    const response = await fetch('/api/admin/certification-sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    });

    if (!response.ok) {
      setError('Failed to update section.');
      return;
    }

    setEditId(null);
    setEditForm(emptyForm);
    loadSections();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch('/api/admin/certification-sections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setError('Failed to delete section.');
      return;
    }

    loadSections();
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }
    await handleDelete(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-playfair font-semibold text-primary">Certification Sections</h2>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            + Add New Section
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6 space-y-4 rounded-md border border-slate-200 p-4">
          <input
            type="text"
            value={form.heading}
            onChange={(event) => setForm((prev) => ({ ...prev, heading: event.target.value }))}
            placeholder="Section Heading"
            className="w-full rounded-sm border border-slate-200 px-3 py-3 text-center text-2xl font-playfair font-bold text-primary placeholder:text-slate-300 md:text-3xl"
          />

          <RichTextEditor
            key={addFormKey}
            value={form.description}
            onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
            placeholder="Write the section description..."
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Save Section
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setForm(emptyForm);
                setAddFormKey((prev) => prev + 1);
              }}
              className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
      {!isLoading && sections.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-600">No sections yet.</p>
      )}

      <div className="space-y-4">
        {sections.map((section) =>
          editId === section.id ? (
            <div key={section.id} className="space-y-4 rounded-md border border-slate-200 p-4">
              <input
                type="text"
                value={editForm.heading}
                onChange={(event) => setEditForm((prev) => ({ ...prev, heading: event.target.value }))}
                placeholder="Section Heading"
                className="w-full rounded-sm border border-slate-200 px-3 py-3 text-center text-2xl font-playfair font-bold text-primary placeholder:text-slate-300 md:text-3xl"
              />

              <RichTextEditor
                key={section.id}
                value={editForm.description}
                onChange={(html) => setEditForm((prev) => ({ ...prev, description: html }))}
                placeholder="Write the section description..."
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate(section.id)}
                  className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setEditForm(emptyForm);
                  }}
                  className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div key={section.id} className="rounded-md border border-slate-200 p-4">
              <h3 className="mb-2 text-center text-xl font-playfair font-bold text-primary">{section.heading}</h3>
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: section.description }} />
              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditId(section.id);
                    setEditForm({ heading: section.heading, description: section.description });
                  }}
                  className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-medium text-primary hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(section.id)}
                  className="rounded-sm border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Section"
        message="Are you sure you want to delete this section?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
