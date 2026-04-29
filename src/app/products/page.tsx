import Image from 'next/image';
import SEOHead from '@/components/SEOHead';
import { getProductCategories } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 3600;

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

      {visibleCategories.map((category, index) => (
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

            <ProductGrid products={category.products} />
          </div>
        </section>
      ))}
    </>
  );
}

