import Image from 'next/image';
import SEOHead from '@/components/SEOHead';
import { getCertifications, getCertificationSections } from '@/lib/data';

export const revalidate = 3600;

export default async function CertificationsPage() {
  const [certifications, sections] = await Promise.all([getCertifications(), getCertificationSections()]);

  return (
    <>
      <SEOHead
        title="Certifications"
        description="Explore all certifications and compliance marks of Mark Designers."
        keywords="certifications, compliance, quality assurance, mark designers"
      />

      <section className="relative h-[45vh] md:h-[56vh] overflow-hidden">
        <Image src="/p1.jpg" alt="Certifications" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl">Certifications and Compliance</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 md:text-lg">
              Internationally recognized certifications that reinforce our quality commitment.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {certifications.map((certification) => (
              <article
                key={certification.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full bg-white">
                  <Image
                    src={certification.logoUrl}
                    alt={certification.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="bg-primary px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-white">{certification.name}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {sections.length > 0 && (
        <section className="section-padding bg-slate-50">
          <div className="container-custom space-y-16">
            {sections.map((section) => (
              <div key={section.id} className="mx-auto max-w-3xl text-center">
                <h2 className="heading-secondary">{section.heading}</h2>
                <div className="rich-content text-left" dangerouslySetInnerHTML={{ __html: section.description }} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
