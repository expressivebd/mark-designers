import Image from 'next/image';
import SEOHead from '@/components/SEOHead';
import { getCertifications } from '@/lib/data';

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <>
      <SEOHead
        title="Certifications"
        description="Explore all certifications and compliance marks of Mark Designers."
        keywords="certifications, compliance, quality assurance, mark designers"
      />

      <section className="relative h-[45vh] md:h-[56vh] overflow-hidden">
        <Image src="/p3.jpg" alt="Certifications" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl">Certifications</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 md:text-lg">
              Internationally recognized certifications that reinforce our quality commitment.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="heading-secondary mb-2">Certifications & Compliance</h2>
            <div className="mx-auto h-1 w-16 bg-accent" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {certifications.map((certification) => (
              <article
                key={certification.id}
                title={certification.name}
                className="card cursor-pointer overflow-hidden border border-slate-100 p-4"
              >
                <div className="relative mx-auto h-24 w-full max-w-[220px] bg-slate-50">
                  <Image
                    src={certification.logoUrl}
                    alt={certification.name}
                    fill
                    className="object-contain"
                    sizes="220px"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
