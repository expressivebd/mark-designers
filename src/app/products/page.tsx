import Image from 'next/image';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';
import { getProductCategories, getProductGenders } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 3600;

export default async function ProductsPage() {
  const [genderCards, allCategories] = await Promise.all([
    getProductGenders(),
    getProductCategories(),
  ]);

  return (
    <>
      <SEOHead
        title="Products"
        description="Explore our garment collections for Ladies, Men's, and Kids' — Outerwear, Tops, and Bottoms."
        keywords="products, garments, outerwear, tops, bottoms, ladies, mens, kids, mark designers"
      />

      {/* Hero */}
      <section className="relative h-[45vh] md:h-[56vh] overflow-hidden">
        <Image src="/p3.jpg" alt="Our Products" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl">Our Products</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 md:text-lg">
              To View the Full Extent of Our Products Please Check Out The Downloadable Catalogue
            </p>
          </div>
        </div>
      </section>

      {/* Gender Category Cards */}
      {genderCards.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {genderCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative block overflow-hidden rounded-2xl aspect-square"
                >
                  <Image
                    src={card.imageUrl || '/p3.jpg'}
                    alt={card.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-playfair font-bold">{card.name}</h2>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-accent transition-colors duration-300">
                      Explore Collection
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
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

      {/* Category Sections */}
      {allCategories.map((genCat, genIndex) => {
        const details = genCat.categoryDetails?.details ?? [];
        const thumbnailUrl = genCat.categoryDetails?.thumbnailUrl ?? '';
        const allProducts = genCat.products ?? [];

        return (
          <section
            key={genCat.slug}
            id={genCat.slug}
            className={`section-padding ${genIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="container-custom">

              {/* Section heading */}
              <div className="mb-12 text-center">
                <h2 className="heading-secondary mb-2">{genCat.name}</h2>
                <div className="mx-auto h-1 w-16 bg-accent" />
              </div>

              {/* Gender sub-sections */}
              <div className="space-y-14 mb-20">
                {genderCards.map((gender) => {
                  const products = allProducts.filter(p => p.genderId === gender.id).slice(0, 4);

                  return (
                    <div key={gender.slug}>
                      {/* Sub-section header */}
                      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                        <h3 className="text-2xl font-playfair font-semibold text-primary">
                          {gender.name}
                        </h3>
                        <Link
                          href={`/products/${gender.slug}#${genCat.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                        >
                          View All
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>

                      {products.length > 0 ? (
                        <ProductGrid products={products} />
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                          <p className="text-slate-400 text-sm">Products coming soon</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Product Breakdown — 5-col grid with zigzag cards */}
              {thumbnailUrl && details.length > 0 && (
                <div>
                  <div className="mb-10 text-center">
                    <h3 className="text-2xl font-playfair font-semibold text-primary">
                      {genCat.name} — Product Breakdown
                    </h3>
                    <div className="mx-auto mt-2 h-0.5 w-12 bg-accent" />
                  </div>

                  {/* Mobile: stack vertically. Desktop: 5-col grid — 2 cols photo, 3 cols cards */}
                  <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-6">

                    {/* Left col — main product photo, 3:4 portrait */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-md">
                      <Image
                        src={thumbnailUrl}
                        alt={`${genCat.name} overview`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                    </div>

                    {/* Right col — aspect-[3/4] matches left col height (equal widths, equal ratios) */}
                    <div className="flex flex-col gap-3 aspect-[3/4] overflow-hidden">
                      {details.slice(0, 4).map((detail, i) => {
                        const photoLeft = i % 2 === 0;
                        return (
                          <div
                            key={i}
                            className={`flex flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm ${
                              photoLeft ? '' : 'flex-row-reverse'
                            }`}
                          >
                            {detail.photoUrl && (
                              <div className="relative w-2/5 flex-shrink-0 m-3 overflow-hidden rounded-lg">
                                <Image
                                  src={detail.photoUrl}
                                  alt={`${genCat.name} detail ${i + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 40vw, 24vw"
                                />
                              </div>
                            )}
                            {detail.text && (
                              <div className="flex flex-1 items-center p-4 md:p-6">
                                <p className="text-base md:text-lg leading-relaxed text-gray-700">
                                  {detail.text}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              )}

            </div>
          </section>
        );
      })}
    </>
  );
}
