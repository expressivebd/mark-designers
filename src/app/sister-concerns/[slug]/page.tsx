import { notFound } from 'next/navigation';
import SisterConcernDetail from '@/components/SisterConcernDetail';
import { getSisterConcernBySlug } from '@/lib/data';

type Params = {
  slug: string;
};

export default async function SisterConcernDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const concern = await getSisterConcernBySlug(slug);

  if (!concern) {
    notFound();
  }

  const descriptionParagraphs = concern.description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <SisterConcernDetail
      data={{
        name: concern.name,
        tagline: concern.tagline || 'Tagline will be updated soon.',
        location: concern.location,
        fullAddress: concern.location,
        established: concern.establishedYear,
        heroImage: concern.thumbnailUrl || '/p1.jpg',
        description: descriptionParagraphs.length ? descriptionParagraphs : [concern.description],
        stats: [
          { value: concern.capacity || '-', label: 'Daily Capacity' },
          { value: concern.personnel || '-', label: 'Personnel' },
          {
            value: concern.yearsInOperation ? `${concern.yearsInOperation}+` : '-',
            label: 'Years in Operation',
          },
          { value: concern.totalMachines || '-', label: 'Total Machines' },
        ],
        machineryImages:
          concern.factoryPhotos?.map((src, index) => ({
            src,
            alt: `Factory Photo ${index + 1}`,
            description: '',
          })) || [],
      }}
    />
  );
}
