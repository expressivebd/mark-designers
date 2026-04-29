'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import UploadField from './UploadField';
import StatsEditor from './StatsEditor';

type AboutStat = {
  label: string;
  number: number;
  suffix: string;
};

type FacilityItem = {
  name: string;
  imageUrl: string;
};

type ExpertiseItem = {
  name: string;
  details: string;
  imageUrl: string;
};

type AboutPageData = {
  journey: string;
  stats: AboutStat[];
  facilities: FacilityItem[];
  expertise: ExpertiseItem[];
};

const defaultData: AboutPageData = {
  journey: '',
  stats: [
    { label: 'Total Sister Concerns', number: 3, suffix: '' },
    { label: 'Daily Capacity (pcs)', number: 45000, suffix: '+' },
    { label: 'Total Personnel', number: 8000, suffix: '+' },
    { label: 'Years of Experience', number: 30, suffix: '+' },
  ],
  facilities: [],
  expertise: [],
};

const emptyFacility: FacilityItem = { name: '', imageUrl: '' };
const emptyExpertise: ExpertiseItem = { name: '', details: '', imageUrl: '' };

function DragHandle() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 text-slate-300"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  );
}

export default function AboutPageController() {
  const [data, setData] = useState<AboutPageData>(defaultData);
  const [facilityDraft, setFacilityDraft] = useState<FacilityItem>(emptyFacility);
  const [expertiseDraft, setExpertiseDraft] = useState<ExpertiseItem>(emptyExpertise);
  const [facilityEditIndex, setFacilityEditIndex] = useState<number | null>(null);
  const [facilityEditDraft, setFacilityEditDraft] = useState<FacilityItem>(emptyFacility);
  const [expertiseEditIndex, setExpertiseEditIndex] = useState<number | null>(null);
  const [expertiseEditDraft, setExpertiseEditDraft] = useState<ExpertiseItem>(emptyExpertise);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');

  // Drag state for facilities
  const [facilityDragIndex, setFacilityDragIndex] = useState<number | null>(null);
  const [facilityDragOverIndex, setFacilityDragOverIndex] = useState<number | null>(null);

  // Drag state for expertise
  const [expertiseDragIndex, setExpertiseDragIndex] = useState<number | null>(null);
  const [expertiseDragOverIndex, setExpertiseDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/admin/about');
        if (!response.ok) {
          throw new Error('Failed to load about page data');
        }

        const payload = (await response.json()) as Partial<AboutPageData> | null;
        if (!payload) {
          setData(defaultData);
          return;
        }

        setData({
          journey: String(payload.journey || ''),
          stats: Array.isArray(payload.stats) && payload.stats.length > 0
            ? payload.stats.map((item) => ({
                label: String(item.label || ''),
                number: Number(item.number || 0),
                suffix: String(item.suffix || ''),
              }))
            : defaultData.stats,
          facilities: Array.isArray(payload.facilities)
            ? payload.facilities.map((item) => ({
                name: String(item.name || ''),
                imageUrl: String(item.imageUrl || ''),
              }))
            : [],
          expertise: Array.isArray(payload.expertise)
            ? payload.expertise.map((item) => ({
                name: String(item.name || ''),
                details: String(item.details || ''),
                imageUrl: String(item.imageUrl || ''),
              }))
            : [],
        });
      } catch {
        setStatus('Failed to load about page data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ── Facility drag handlers ──────────────────────────────────────────────────

  const handleFacilityDragStart = (event: React.DragEvent, index: number) => {
    setFacilityDragIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleFacilityDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (index !== facilityDragIndex) {
      setFacilityDragOverIndex(index);
    }
  };

  const handleFacilityDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    if (facilityDragIndex === null || facilityDragIndex === dropIndex) {
      setFacilityDragIndex(null);
      setFacilityDragOverIndex(null);
      return;
    }
    setData((prev) => {
      const items = [...prev.facilities];
      const [dragged] = items.splice(facilityDragIndex, 1);
      items.splice(dropIndex, 0, dragged);
      return { ...prev, facilities: items };
    });
    setFacilityDragIndex(null);
    setFacilityDragOverIndex(null);
  };

  const handleFacilityDragEnd = () => {
    setFacilityDragIndex(null);
    setFacilityDragOverIndex(null);
  };

  // ── Expertise drag handlers ─────────────────────────────────────────────────

  const handleExpertiseDragStart = (event: React.DragEvent, index: number) => {
    setExpertiseDragIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleExpertiseDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (index !== expertiseDragIndex) {
      setExpertiseDragOverIndex(index);
    }
  };

  const handleExpertiseDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    if (expertiseDragIndex === null || expertiseDragIndex === dropIndex) {
      setExpertiseDragIndex(null);
      setExpertiseDragOverIndex(null);
      return;
    }
    setData((prev) => {
      const items = [...prev.expertise];
      const [dragged] = items.splice(expertiseDragIndex, 1);
      items.splice(dropIndex, 0, dragged);
      return { ...prev, expertise: items };
    });
    setExpertiseDragIndex(null);
    setExpertiseDragOverIndex(null);
  };

  const handleExpertiseDragEnd = () => {
    setExpertiseDragIndex(null);
    setExpertiseDragOverIndex(null);
  };

  // ── CRUD handlers ───────────────────────────────────────────────────────────

  const saveFacility = () => {
    if (!facilityDraft.name.trim() || !facilityDraft.imageUrl.trim()) {
      setStatus('Facility name and photo are required.');
      return;
    }

    setData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, { ...facilityDraft, name: facilityDraft.name.trim() }],
    }));
    setFacilityDraft(emptyFacility);
    setStatus('Facility added to draft list. Save About Page to publish.');
  };

  const saveExpertise = () => {
    if (!expertiseDraft.name.trim() || !expertiseDraft.details.trim() || !expertiseDraft.imageUrl.trim()) {
      setStatus('Expertise name, details, and photo are required.');
      return;
    }

    setData((prev) => ({
      ...prev,
      expertise: [...prev.expertise, {
        ...expertiseDraft,
        name: expertiseDraft.name.trim(),
        details: expertiseDraft.details.trim(),
      }],
    }));
    setExpertiseDraft(emptyExpertise);
    setStatus('Expertise item added to draft list. Save About Page to publish.');
  };

  const saveFacilityEdit = () => {
    if (facilityEditIndex === null) {
      return;
    }

    if (!facilityEditDraft.name.trim() || !facilityEditDraft.imageUrl.trim()) {
      setStatus('Facility name and photo are required.');
      return;
    }

    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((item, index) =>
        index === facilityEditIndex
          ? { ...facilityEditDraft, name: facilityEditDraft.name.trim() }
          : item
      ),
    }));
    setFacilityEditIndex(null);
    setFacilityEditDraft(emptyFacility);
    setStatus('Facility updated in draft list. Save About Page to publish.');
  };

  const saveExpertiseEdit = () => {
    if (expertiseEditIndex === null) {
      return;
    }

    if (!expertiseEditDraft.name.trim() || !expertiseEditDraft.details.trim() || !expertiseEditDraft.imageUrl.trim()) {
      setStatus('Expertise name, details, and photo are required.');
      return;
    }

    setData((prev) => ({
      ...prev,
      expertise: prev.expertise.map((item, index) =>
        index === expertiseEditIndex
          ? {
              ...expertiseEditDraft,
              name: expertiseEditDraft.name.trim(),
              details: expertiseEditDraft.details.trim(),
            }
          : item
      ),
    }));
    setExpertiseEditIndex(null);
    setExpertiseEditDraft(emptyExpertise);
    setStatus('Expertise item updated in draft list. Save About Page to publish.');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('');

    const response = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setStatus('Failed to save about page.');
      setIsSaving(false);
      return;
    }

    setStatus('About page updated successfully.');
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-playfair font-semibold text-primary">Our Journey</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Journey Text</label>
          <textarea
            value={data.journey}
            onChange={(event) => setData((prev) => ({ ...prev, journey: event.target.value }))}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            rows={8}
            placeholder="Write your journey content. Use blank lines to separate paragraphs."
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-playfair font-semibold text-primary">Stats Section</h2>
        <StatsEditor
          stats={data.stats}
          onChange={(stats) => setData((prev) => ({ ...prev, stats }))}
        />
      </div>

      {/* ── The Process ─────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-playfair font-semibold text-primary">The Process</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Facility Name</label>
            <input
              type="text"
              value={facilityDraft.name}
              onChange={(event) => setFacilityDraft((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <UploadField
            label="Facility Photo"
            value={facilityDraft.imageUrl}
            folder="facilities"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(url) => setFacilityDraft((prev) => ({ ...prev, imageUrl: url }))}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveFacility}
            className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Save Facility
          </button>
          <button
            type="button"
            onClick={() => setFacilityDraft(emptyFacility)}
            className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary"
          >
            Add New Facility
          </button>
        </div>

        {data.facilities.length > 0 && (
          <>
            <p className="text-xs text-slate-400">Drag cards to reorder. The frontend will reflect this order.</p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.facilities.map((item, index) => (
                <div
                  key={index}
                  draggable={facilityEditIndex === null}
                  onDragStart={(event) => { if (facilityEditIndex === null) handleFacilityDragStart(event, index); }}
                  onDragOver={(event) => handleFacilityDragOver(event, index)}
                  onDrop={(event) => handleFacilityDrop(event, index)}
                  onDragEnd={handleFacilityDragEnd}
                  className={`rounded-md border p-3 space-y-2 transition-all duration-150 select-none ${
                    facilityDragIndex === index
                      ? 'opacity-40 border-slate-300 bg-slate-50 scale-95'
                      : facilityDragOverIndex === index && facilityDragIndex !== null
                        ? 'border-primary border-dashed bg-primary/5 scale-[1.02]'
                        : 'border-slate-200 bg-white'
                  }`}
                  style={{ cursor: facilityEditIndex === null ? (facilityDragIndex === index ? 'grabbing' : 'grab') : 'default' }}
                >
                  {facilityEditIndex === index ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-primary">Facility Name</label>
                        <input
                          type="text"
                          value={facilityEditDraft.name}
                          onChange={(event) =>
                            setFacilityEditDraft((prev) => ({ ...prev, name: event.target.value }))
                          }
                          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>

                      <UploadField
                        label="Facility Photo"
                        value={facilityEditDraft.imageUrl}
                        folder="facilities"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={(url) => setFacilityEditDraft((prev) => ({ ...prev, imageUrl: url }))}
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveFacilityEdit}
                          className="rounded-sm bg-primary px-3 py-1 text-xs font-medium text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFacilityEditIndex(null);
                            setFacilityEditDraft(emptyFacility);
                          }}
                          className="rounded-sm border border-slate-200 px-3 py-1 text-xs font-medium text-primary"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 pb-1">
                        <DragHandle />
                        <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                      </div>
                      {item.imageUrl && (
                        <div className="relative h-24 w-32 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFacilityEditIndex(index);
                            setFacilityEditDraft(item);
                          }}
                          className="rounded-sm border border-slate-200 px-3 py-1 text-xs font-medium text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              facilities: prev.facilities.filter((_, itemIndex) => itemIndex !== index),
                            }));
                          }}
                          className="rounded-sm border border-red-200 px-3 py-1 text-xs font-medium text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Our Expertise ───────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-playfair font-semibold text-primary">Our Expertise</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Expertise Name</label>
            <input
              type="text"
              value={expertiseDraft.name}
              onChange={(event) => setExpertiseDraft((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <UploadField
            label="Expertise Photo"
            value={expertiseDraft.imageUrl}
            folder="expertise"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(url) => setExpertiseDraft((prev) => ({ ...prev, imageUrl: url }))}
          />
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-primary">Details</label>
            <textarea
              value={expertiseDraft.details}
              onChange={(event) => setExpertiseDraft((prev) => ({ ...prev, details: event.target.value }))}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
              rows={4}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveExpertise}
            className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Save Expertise
          </button>
          <button
            type="button"
            onClick={() => setExpertiseDraft(emptyExpertise)}
            className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-medium text-primary"
          >
            Add New Expertise
          </button>
        </div>

        {data.expertise.length > 0 && (
          <>
            <p className="text-xs text-slate-400">Drag cards to reorder. The frontend will reflect this order.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {data.expertise.map((item, index) => (
                <div
                  key={index}
                  draggable={expertiseEditIndex === null}
                  onDragStart={(event) => { if (expertiseEditIndex === null) handleExpertiseDragStart(event, index); }}
                  onDragOver={(event) => handleExpertiseDragOver(event, index)}
                  onDrop={(event) => handleExpertiseDrop(event, index)}
                  onDragEnd={handleExpertiseDragEnd}
                  className={`rounded-md border p-3 space-y-2 transition-all duration-150 select-none ${
                    expertiseDragIndex === index
                      ? 'opacity-40 border-slate-300 bg-slate-50 scale-95'
                      : expertiseDragOverIndex === index && expertiseDragIndex !== null
                        ? 'border-primary border-dashed bg-primary/5 scale-[1.02]'
                        : 'border-slate-200 bg-white'
                  }`}
                  style={{ cursor: expertiseEditIndex === null ? (expertiseDragIndex === index ? 'grabbing' : 'grab') : 'default' }}
                >
                  {expertiseEditIndex === index ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-primary">Expertise Name</label>
                        <input
                          type="text"
                          value={expertiseEditDraft.name}
                          onChange={(event) =>
                            setExpertiseEditDraft((prev) => ({ ...prev, name: event.target.value }))
                          }
                          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>

                      <UploadField
                        label="Expertise Photo"
                        value={expertiseEditDraft.imageUrl}
                        folder="expertise"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={(url) => setExpertiseEditDraft((prev) => ({ ...prev, imageUrl: url }))}
                      />

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-primary">Details</label>
                        <textarea
                          value={expertiseEditDraft.details}
                          onChange={(event) =>
                            setExpertiseEditDraft((prev) => ({ ...prev, details: event.target.value }))
                          }
                          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveExpertiseEdit}
                          className="rounded-sm bg-primary px-3 py-1 text-xs font-medium text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExpertiseEditIndex(null);
                            setExpertiseEditDraft(emptyExpertise);
                          }}
                          className="rounded-sm border border-slate-200 px-3 py-1 text-xs font-medium text-primary"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 pb-1">
                        <DragHandle />
                        <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.details}</p>
                      {item.imageUrl && (
                        <div className="relative h-24 w-32 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setExpertiseEditIndex(index);
                            setExpertiseEditDraft(item);
                          }}
                          className="rounded-sm border border-slate-200 px-3 py-1 text-xs font-medium text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              expertise: prev.expertise.filter((_, itemIndex) => itemIndex !== index),
                            }));
                          }}
                          className="rounded-sm border border-red-200 px-3 py-1 text-xs font-medium text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-xl font-playfair font-semibold text-primary">Certifications</h2>
        <p className="text-sm text-gray-600">
          Certifications are managed from Certification Management.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="rounded-sm bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          {isSaving ? 'Saving...' : 'Save About Page'}
        </button>
        {status && <span className="text-sm text-primary">{status}</span>}
      </div>
    </div>
  );
}
