import Image from 'next/image';
import SEOHead from '@/components/SEOHead';
import { getProductCategories } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 3600;

function getDetailsPanelClass(count: number): string {
  if (count === 1) return 'flex flex-col';
  if (count === 2) return 'grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-3';
  // 3-4: mobile 2-per-row, desktop column-first 2×2
  return 'grid grid-cols-2 gap-3 md:grid-rows-2 md:grid-flow-col';
}

export default async function ProductsPage() {
  const categories = await getProductCategories();
  const visibleCategories = categories.filter((category) => category.products.length > 0);

  return (
    <>
      <SEOHead
        title="Products"
        description="Explore our category-based product collections from Mark Designers."
        keywords="products, categories, garments, mark designers"
      />

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

      <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-custom py-4">
          <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
            {visibleCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.slug}`}
                className="whitespace-nowrap rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {visibleCategories.map((category, index) => {
        const details = category.categoryDetails?.details ?? [];
        const hasThumbnail = Boolean(category.categoryDetails?.thumbnailUrl);
        const hasDetailItems = details.length > 0;

        return (
          <section
            key={category.id}
            id={category.slug}
            className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="container-custom">
              <div className="mb-10 text-center">
                <h2 className="heading-secondary mb-2">{category.name}</h2>
                <div className="mx-auto h-1 w-16 bg-accent" />
              </div>

              {hasThumbnail ? (
                <>
                  {/* Thumbnail (1:1 on mobile, height-matched on desktop) left + details right */}
                  <div
                    className={`mb-10 flex flex-col gap-4 ${
                      hasDetailItems ? 'md:flex-row md:items-stretch md:gap-6' : ''
                    }`}
                  >
                    {/* Thumbnail — 1:1 on mobile, stretches to details height on desktop */}
                    <div
                      className={`relative overflow-hidden rounded-xl border border-slate-200 ${
                        hasDetailItems
                          ? 'aspect-square md:aspect-auto w-full flex-shrink-0 md:w-1/2'
                          : 'aspect-square w-full'
                      }`}
                    >
                      <Image
                        src={category.categoryDetails!.thumbnailUrl}
                        alt={`${category.name} overview`}
                        fill
                        className="object-cover"
                        sizes={hasDetailItems ? '(max-width: 768px) 100vw, 50vw' : '100vw'}
                      />
                    </div>

                    {/* Detail cards */}
                    {hasDetailItems && (
                      <div className="w-full md:w-1/2">
                        <div className={getDetailsPanelClass(details.length)}>
                          {details.map((detail, i) => (
                            <div
                              key={i}
                              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                            >
                              {detail.photoUrl && (
                                <div className="relative aspect-square overflow-hidden bg-slate-100">
                                  <Image
                                    src={detail.photoUrl}
                                    alt={`${category.name} detail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                  />
                                </div>
                              )}
                              {detail.text && (
                                <div className="p-3">
                                  <p className="text-xs leading-relaxed text-gray-700">{detail.text}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-header before products */}
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-playfair font-semibold text-primary">
                      More from this category
                    </h3>
                    <div className="mx-auto mt-2 h-0.5 w-12 bg-accent" />
                  </div>

                  <ProductGrid products={category.products} />
                </>
              ) : (
                <ProductGrid products={category.products} />
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
