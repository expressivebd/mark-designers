import Image from 'next/image';
import SEOHead from '@/components/SEOHead';
import { getClients } from '@/lib/data';

export const revalidate = 3600;

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <>
      <SEOHead
        title="Clients"
        description="Explore our global client portfolio and trusted brand partners."
        keywords="clients, brand partners, global clients, mark designers"
      />

      <section className="relative h-[45vh] md:h-[56vh] overflow-hidden">
        <Image src="/p1.jpg" alt="Our Clients" fill priority className="object-cover" />
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
          {/* <div className="mb-10 text-center">
            <h2 className="heading-secondary mb-2">Clients</h2>
            <div className="mx-auto h-1 w-16 bg-accent" />
          </div> */}

          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {clients.map((client) => (
              <article
                key={client.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[3/2] w-full bg-white">
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, 25vw"
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
