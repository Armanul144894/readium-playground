"use client";

import { use, useMemo } from "react";

import Link from "next/link";

import "@/app/home.css";

import {
  AppShell,
  BookGrid,
  CategoryCard,
  EmptyState,
  SectionHeading,
  SiteFooter,
  SiteHeader,
  StatusMessage
} from "@/app/BooklyUi";
import { useBooklyCatalog } from "@/app/useBooklyCatalog";

type Params = { id: string };

type Props = {
  params: Promise<Params>;
};

export default function CategoryProductsPage({ params }: Props) {
  const categoryId = decodeURIComponent(use(params).id);
  const { catalog, isLoading, error } = useBooklyCatalog();

  const category = useMemo(() => (
    catalog.categories.find((item) => item.id === categoryId)
  ), [catalog.categories, categoryId]);

  const books = category ? catalog.booksByCategoryId.get(category.id) ?? [] : [];

  return (
    <AppShell>
      <SiteHeader />

      { isLoading && <StatusMessage>Loading category products...</StatusMessage> }
      { error && <StatusMessage tone="error">{ error }</StatusMessage> }

      { category && (
        <section className="mb-10 rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-normal text-teal-700">Category wise products</p>
          <h1 className="mb-3 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">{ category.name }</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">Browse all Bookly eBooks grouped under this category.</p>
        </section>
      ) }

      { !isLoading && !error && !category && (
        <EmptyState>This category was not found.</EmptyState>
      ) }

      { category && (
        <section className="mb-10">
          <SectionHeading
            eyebrow={`${ books.length } product${ books.length === 1 ? "" : "s" }`}
            title={`${ category.name } eBooks`}
            action={ (
              <Link
                className="text-sm font-extrabold text-teal-700 hover:text-teal-900"
                href="/#categories"
              >
                All categories
              </Link>
            ) }
          />
          { books.length > 0 ? (
            <BookGrid books={ books } />
          ) : (
            <EmptyState>No products are available in this category yet.</EmptyState>
          ) }
        </section>
      ) }

      <section className="mb-10">
        <SectionHeading
          eyebrow="Explore more"
          title="Other Categories"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          { catalog.categories.filter((item) => item.id !== categoryId).slice(0, 5).map((item) => (
            <CategoryCard
              category={ item }
              key={ item.id }
            />
          )) }
        </div>
      </section>

      <SiteFooter />
    </AppShell>
  );
}
