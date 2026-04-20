'use client';

import { useEffect, useState } from 'react';
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

export default function AboutPageController() {
  const [data, setData] = useState<AboutPageData>(defaultData);
  const [facilityDraft, setFacilityDraft] = useState<FacilityItem>(emptyFacility);
  const [expertiseDraft, setExpertiseDraft] = useState<ExpertiseItem>(emptyExpertise);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');

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

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-playfair font-semibold text-primary">Our Facilities</h2>
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.facilities.map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-md border border-slate-200 p-3 space-y-2">
                <p className="text-sm font-medium text-primary">{item.name}</p>
                <p className="text-xs text-gray-500 break-all">{item.imageUrl}</p>
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
            ))}
          </div>
        )}
      </div>

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
          <div className="grid gap-3 md:grid-cols-2">
            {data.expertise.map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-md border border-slate-200 p-3 space-y-2">
                <p className="text-sm font-medium text-primary">{item.name}</p>
                <p className="text-xs text-gray-500">{item.details}</p>
                <p className="text-xs text-gray-500 break-all">{item.imageUrl}</p>
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
            ))}
          </div>
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
