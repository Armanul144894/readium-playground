"use client";

import { use, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import "@/app/home.css";

import {
  AppShell,
  BookMeta,
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

export default function EbookProductPage({ params }: Props) {
  const productSlug = decodeURIComponent(use(params).slug);
  const { catalog, isLoading, error } = useBooklyCatalog();

  const book = useMemo(() => (
    catalog.moreProducts.find((item) => item.slug === productSlug || item.id === productSlug)
  ), [catalog.moreProducts, productSlug]);

  return (
    <AppShell>
      <SiteHeader />

      { isLoading && <StatusMessage>Loading eBook...</StatusMessage> }
      { error && <StatusMessage tone="error">{ error }</StatusMessage> }

      { !isLoading && !error && !book && (
        <EmptyState>This eBook was not found.</EmptyState>
      ) }

      { book && (
        <>
          <section className="mb-10 grid gap-7 rounded-lg border border-slate-200 bg-white p-4 shadow-xl sm:p-6 lg:grid-cols-[minmax(260px,0.48fr)_minmax(0,1fr)] lg:p-8">
            <figure
              className="relative min-h-[320px] overflow-hidden rounded-lg sm:min-h-[430px]"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${ book.color } 28%, #ffffff), #edf3f6)`
              }}
            >
              <Image
                src={ book.cover }
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-contain p-6 drop-shadow-2xl"
              />
            </figure>

            <div className="flex min-w-0 flex-col justify-center">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-normal text-teal-700">Bookly eBook</p>
              <h1 className="mb-4 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">{ book.title }</h1>
              { book.author && <p className="mb-4 text-lg font-bold text-slate-600">{ book.author }</p> }
              { book.subtitle && <p className="mb-5 max-w-2xl text-base leading-7 text-slate-600">{ book.subtitle }</p> }
              <BookMeta book={ book } />
              <div className="mt-6 flex flex-wrap gap-3">
                { book.readerUrl && (
                  <a
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-700 px-5 font-extrabold text-white hover:bg-teal-800 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    href={ book.readerUrl }
                  >
                    Read eBook
                  </a>
                ) }
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 font-extrabold text-teal-700 hover:bg-teal-50 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  href="/products"
                >
                  Back to products
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <SectionHeading
              eyebrow="More to explore"
              title="Recommended eBooks"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              { catalog.moreProducts.filter((item) => item.slug !== book.slug).slice(0, 6).map((item) => (
                <Link
                  className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-extrabold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:text-teal-700 hover:shadow-lg"
                  href={ item.productUrl }
                  key={ item.slug }
                >
                  { item.title }
                </Link>
              )) }
            </div>
          </section>
        </>
      ) }

      <SiteFooter />
    </AppShell>
  );
}
