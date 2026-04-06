'use client';

import { useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import HeroEditor from '@/components/admin/HeroEditor';
import AboutEditor from '@/components/admin/AboutEditor';
import SustainabilityEditor from '@/components/admin/SustainabilityEditor';
import Link from 'next/link';

const defaultHero = {
  videoUrl: '',
  headlines: [''],
  subheadline: '',
};

const defaultAbout = {
  text: '',
  stats: [
    { label: 'Years of Experience', number: 0, suffix: '+' },
    { label: 'Certifications', number: 0, suffix: '+' },
    { label: 'Clients Served', number: 0, suffix: '+' },
    { label: 'Daily Outputs', number: 0, suffix: '+' },
  ],
};

const defaultSustainability = [
  { title: '', imageUrl: '', description: '', link: '/about' },
  { title: '', imageUrl: '', description: '', link: '/about' },
  { title: '', imageUrl: '', description: '', link: '/about' },
];

export default function HomepageAdmin() {
  const [hero, setHero] = useState(defaultHero);
  const [about, setAbout] = useState(defaultAbout);
  const [sustainability, setSustainability] = useState(defaultSustainability);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/api/admin/homepage');
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (!data) {
        return;
      }
      setHero(data.hero || defaultHero);
      setAbout(data.about || defaultAbout);
      setSustainability(data.sustainability || defaultSustainability);
    };

    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('');
    const response = await fetch('/api/admin/homepage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hero, about, sustainability }),
    });

    if (!response.ok) {
      setStatus('Failed to save changes.');
      setIsSaving(false);
      return;
    }

    setStatus('Homepage updated successfully.');
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Homepage Control"
        description="Update hero content, about stats, and sustainability cards."
      />

      <AdminCard>
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Hero Section</h2>
        <HeroEditor value={hero} onChange={setHero} />
      </AdminCard>

      <AdminCard>
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">About Section</h2>
        <AboutEditor value={about} onChange={setAbout} />
      </AdminCard>

      <AdminCard>
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Sustainability Section</h2>
        <p className="text-sm text-gray-600 mb-4">Exactly three cards are required.</p>
        <SustainabilityEditor items={sustainability} onChange={setSustainability} />
      </AdminCard>

      <AdminCard>
        <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Managed Sections</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Link href="/admin/sister-concerns" className="rounded-sm border border-slate-200 px-4 py-3 text-sm font-medium text-primary hover:border-accent">
            Sister Concerns Management
          </Link>
          <Link href="/admin/product-management" className="rounded-sm border border-slate-200 px-4 py-3 text-sm font-medium text-primary hover:border-accent">
            Product Management
          </Link>
          <Link href="/admin/certification-management" className="rounded-sm border border-slate-200 px-4 py-3 text-sm font-medium text-primary hover:border-accent">
            Certification Management
          </Link>
          <Link href="/admin/client-management" className="rounded-sm border border-slate-200 px-4 py-3 text-sm font-medium text-primary hover:border-accent">
            Client Management
          </Link>
          <Link href="/admin/news-management" className="rounded-sm border border-slate-200 px-4 py-3 text-sm font-medium text-primary hover:border-accent">
            News Management
          </Link>
        </div>
      </AdminCard>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-sm bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          {isSaving ? 'Saving...' : 'Save Homepage'}
        </button>
        {status && <span className="text-sm text-primary">{status}</span>}
      </div>
    </div>
  );
}
