"use client";

import {
  BookGrid,
  CategoryCard,
  EmptyState,
  SectionHeading,
  StatusMessage
} from "@/app/BooklyUi";
import { useBooklyCatalog } from "@/app/useBooklyCatalog";

export default function ProductsPage() {
  const { catalog, isLoading, error } = useBooklyCatalog();
  const { categories, moreProducts } = catalog;

  return (
    <>
      { isLoading && <StatusMessage>Loading products...</StatusMessage> }
      { error && <StatusMessage tone="error">{ error }</StatusMessage> }

      <section className="mb-10 border-b border-slate-200 pb-7">
        <p className="mb-2 text-xs font-black uppercase tracking-normal text-red-700">All products</p>
        <h1 className="mb-3 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">Bookly eBooks Products</h1>
        <p className="max-w-2xl text-base font-semibold leading-7 text-slate-600">Browse every available Bookly eBook in one responsive product catalog.</p>
      </section>

      <section className="mb-10">
        <SectionHeading
          eyebrow="Browse by category"
          title="Categories"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          { categories.map((category) => (
            <CategoryCard
              category={ category }
              key={ category.slug }
            />
          )) }
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading
          eyebrow={`${ moreProducts.length } product${ moreProducts.length === 1 ? "" : "s" }`}
          title="All eBooks"
        />
        { moreProducts.length > 0 ? (
          <BookGrid books={ moreProducts } />
        ) : (
          !isLoading && !error && <EmptyState>No products are available right now.</EmptyState>
        ) }
      </section>
    </>
  );
}
