import Image from 'next/image';
import SEOHead from '@/components/SEOHead';
import { getClients, getClientStats } from '@/lib/data';

export default async function ClientsPage() {
  const [clients, stats] = await Promise.all([getClients(), getClientStats()]);

  return (
    <>
      <SEOHead
        title="Clients"
        description="Explore our global client portfolio and trusted brand partners."
        keywords="clients, brand partners, global clients, mark designers"
      />

      <section className="relative h-[45vh] md:h-[56vh] overflow-hidden">
        <Image src="/p2.jpg" alt="Our Clients" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl">Our Clients</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 md:text-lg">
              Trusted by leading global brands with long-term partnerships.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="heading-secondary mb-2">Client</h2>
            <div className="mx-auto h-1 w-16 bg-accent" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {clients.map((client) => (
              <article
                key={client.id}
                title={client.name}
                className="card cursor-pointer overflow-hidden border border-slate-100 p-4"
              >
                <div className="relative mx-auto h-24 w-full max-w-[220px] bg-slate-50">
                  <Image src={client.logoUrl} alt={client.name} fill className="object-contain" sizes="220px" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-playfair font-bold text-primary">{stats.totalClients}</p>
              <p className="mt-2 text-sm text-slate-600">Total Number Of Client</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-playfair font-bold text-primary">{stats.countriesServed || '-'}</p>
              <p className="mt-2 text-sm text-slate-600">Total Countries Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-playfair font-bold text-primary">{stats.yearsServed || '-'}</p>
              <p className="mt-2 text-sm text-slate-600">Years Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-playfair font-bold text-primary">{stats.satisfactionPercentage || '-'}</p>
              <p className="mt-2 text-sm text-slate-600">Client Satisfaction Percentage</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
