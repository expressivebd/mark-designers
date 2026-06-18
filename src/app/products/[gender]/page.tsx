import { notFound } from 'next/navigation';
import Image from 'next/image';
import SEOHead from '@/components/SEOHead';
import { getProductGenders, getProductCategories } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';

// ISR: cached until Publish Changes is clicked (revalidatePath flushes the cache).
// dynamicParams = true means brand-new gender slugs render on first request
// without needing a rebuild.
export const revalidate = 3600;
export const dynamicParams = true;

export default async function GenderProductsPage({ params }: { params: Promise<{ gender: string }> }) {
  const { gender: genderSlug } = await params;

  const [genders, allCategories] = await Promise.all([
    getProductGenders(),
    getProductCategories(),
  ]);

  const gender = genders.find((g) => g.slug === genderSlug);

  if (!gender) notFound();

  return (
    <>
      <SEOHead
        title={`${gender.name} Products`}
        description={`Explore our ${gender.name.toLowerCase()} garment collections from Mark Designers.`}
        keywords={`${gender.slug}, garments, mark designers`}
      />

      {/* Hero — same as /products */}
      <section className="relative h-[45vh] md:h-[56vh] overflow-hidden">
        <Image src="/p1.jpg" alt="Our Products" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl">
              {gender.name}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 md:text-lg">
              To View the Full Extent of Our Products Please Check Out The Downloadable Catalogue
            </p>
          </div>
        </div>
      </section>

      {/* No categories yet */}
      {allCategories.length === 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom py-20 text-center">
            <p className="text-slate-400">No categories have been added yet.</p>
          </div>
        </section>
      )}

      {/* Sticky category nav */}
      {allCategories.length > 0 && (
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="container-custom py-4">
            <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
              {allCategories.map((cat) => (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="whitespace-nowrap rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* One section per category */}
      {allCategories.map((cat, index) => {
        const products = cat.products.filter((p) => p.genderId === gender.id);

        return (
          <section
            key={cat.slug}
            id={cat.slug}
            className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="container-custom">
              <div className="mb-10 text-center">
                <h2 className="heading-secondary mb-2">{cat.name}</h2>
                <div className="mx-auto h-1 w-16 bg-accent" />
              </div>

              {products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
                  <p className="text-slate-400 text-sm">
                    No {gender.name} products added to this category yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
