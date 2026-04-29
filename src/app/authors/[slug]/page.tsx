"use client";

import { use, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import "@/app/home.css";

import {
  AppShell,
  AuthorCard,
  BookGrid,
  EmptyState,
  SectionHeading,
  SiteFooter,
  SiteHeader,
  StatusMessage
} from "@/app/BooklyUi";
import { useBooklyCatalog } from "@/app/useBooklyCatalog";

type Params = { slug: string };

type Props = {
  params: Promise<Params>;
};

export default function AuthorProductsPage({ params }: Props) {
  const authorSlug = decodeURIComponent(use(params).slug);
  const { catalog, isLoading, error } = useBooklyCatalog();

  const author = useMemo(() => (
    catalog.authors.find((item) => item.slug === authorSlug || item.id === authorSlug)
  ), [catalog.authors, authorSlug]);

  const books = author ? catalog.booksByAuthorSlug.get(author.slug) ?? [] : [];

  return (
    <AppShell>
      <SiteHeader />

      { isLoading && <StatusMessage>Loading author products...</StatusMessage> }
      { error && <StatusMessage tone="error">{ error }</StatusMessage> }

      { author && (
        <section className="mb-10 grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:p-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          { author.imageUrl && (
            <Image
              src={ author.imageUrl }
              alt=""
              width={ 132 }
              height={ 132 }
              priority
              aria-hidden="true"
              className="h-32 w-32 rounded-full object-cover shadow-lg"
            />
          ) }
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-normal text-teal-700">Author wise products</p>
            <h1 className="mb-3 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">{ author.name }</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">Browse Bookly eBooks written by this author.</p>
          </div>
        </section>
      ) }

      { !isLoading && !error && !author && (
        <EmptyState>This author was not found.</EmptyState>
      ) }

      { author && (
        <section className="mb-10">
          <SectionHeading
            eyebrow={`${ books.length } product${ books.length === 1 ? "" : "s" }`}
            title={`${ author.name } eBooks`}
            action={ (
              <Link
                className="text-sm font-extrabold text-teal-700 hover:text-teal-900"
                href="/#authors"
              >
                All authors
              </Link>
            ) }
          />
          { books.length > 0 ? (
            <BookGrid books={ books } />
          ) : (
            <EmptyState>No products are available for this author yet.</EmptyState>
          ) }
        </section>
      ) }

      <section className="mb-10">
        <SectionHeading
          eyebrow="Explore more"
          title="Other Authors"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          { catalog.authors.filter((item) => item.slug !== authorSlug).slice(0, 7).map((item) => (
            <AuthorCard
              author={ item }
              key={ item.id }
            />
          )) }
        </div>
      </section>

      <SiteFooter />
    </AppShell>
  );
}
