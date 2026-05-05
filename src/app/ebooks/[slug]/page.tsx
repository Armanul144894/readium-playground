"use client";

import { use, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  BookGrid,
  BookMeta,
  EmptyState,
  SectionHeading,
  StatusMessage
} from "@/app/BooklyUi";
import {
  DisplayBook,
  fetchBooklyBookDetail,
  toDisplayBookDetail
} from "@/app/booklyCatalog";
import { useBooklyCatalog } from "@/app/useBooklyCatalog";

type Params = { slug: string };

type Props = {
  params: Promise<Params>;
};

export default function EbookProductPage({ params }: Props) {
  const productSlug = decodeURIComponent(use(params).slug);
  const { catalog, isLoading, error, isManifestEnabled } = useBooklyCatalog();
  const [detailBook, setDetailBook] = useState<DisplayBook | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const catalogBook = useMemo(() => (
    catalog.moreProducts.find((item) => item.slug === productSlug || item.id === productSlug)
  ), [catalog.moreProducts, productSlug]);

  const bookDetailId = catalogBook?.id ?? (/^\d+$/.test(productSlug) ? productSlug : undefined);
  const book = detailBook ?? catalogBook;

  useEffect(() => {
    if (!bookDetailId) {
      setDetailBook(null);
      setDetailError(null);
      return;
    }

    const controller = new AbortController();

    const fetchBookDetail = async () => {
      setIsDetailLoading(true);
      setDetailError(null);
      setDetailBook(null);

      try {
        const bookDetail = await fetchBooklyBookDetail(bookDetailId, controller.signal);
        const displayBook = toDisplayBookDetail(bookDetail, isManifestEnabled);

        if (!displayBook) {
          throw new Error("The book detail API returned an incomplete book.");
        }

        setDetailBook(displayBook);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Error loading Bookly book detail:", error);
        setDetailError("The Bookly book details could not be loaded.");
        setDetailBook(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsDetailLoading(false);
        }
      }
    };

    fetchBookDetail();

    return () => {
      controller.abort();
    };
  }, [bookDetailId, isManifestEnabled]);

  const recommendedBooks = useMemo(() => (
    book
      ? catalog.moreProducts.filter((item) => item.slug !== book.slug).slice(0, 6)
      : []
  ), [book, catalog.moreProducts]);

  return (
    <>
      { isLoading && <StatusMessage>Loading eBook...</StatusMessage> }
      { error && <StatusMessage tone="error">{ error }</StatusMessage> }
      { isDetailLoading && <StatusMessage>Loading book details...</StatusMessage> }
      { detailError && <StatusMessage tone="error">{ detailError }</StatusMessage> }

      { !isLoading && !isDetailLoading && !error && !book && (
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
              <p className="mb-2 text-xs font-black uppercase tracking-normal text-red-700">Bookly eBook</p>
              <h1 className="mb-4 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">{ book.title }</h1>
              { book.author && <p className="mb-4 text-lg font-bold text-slate-600">{ book.author }</p> }
              { book.description && <p className="mb-5 max-w-2xl text-base font-semibold leading-7 text-slate-600">{ book.description }</p> }
              { !book.description && book.subtitle && <p className="mb-5 max-w-2xl text-base leading-7 text-slate-600">{ book.subtitle }</p> }
              <div className="mb-5 flex flex-wrap gap-2">
                { book.language && (
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-normal text-slate-700">
                    { book.language }
                  </span>
                ) }
                { typeof book.totalChapters === "number" && (
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-normal text-slate-700">
                    { book.totalChapters } chapters
                  </span>
                ) }
                { book.categories?.map((category) => (
                  <Link
                    className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-black uppercase tracking-normal text-red-700 hover:bg-red-100"
                    href={ category.href }
                    key={ category.id }
                  >
                    { category.name }
                  </Link>
                )) }
              </div>
              <BookMeta book={ book } />
              <div className="mt-6 flex flex-wrap gap-3">
                { book.readerUrl && (
                  <a
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red-700 px-5 font-black text-white hover:bg-red-800 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    href={ book.readerUrl }
                  >
                    Preview eBook
                  </a>
                ) }
                { !book.readerUrl && (
                  <span className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-5 font-black text-slate-500">
                    Reader preview unavailable
                  </span>
                ) }
                
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 font-black text-red-700 hover:bg-red-50 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  href="/products"
                >
                  Back to products
                </Link>
              </div>
              { !book.readerUrl && (
                <p className="mt-4 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
                  The current Bookly API record includes product metadata and cover art, but no EPUB file URL or Readium manifest URL. Add an <span className="font-black">epubPath</span> or <span className="font-black">manifestUrl</span> field to this book in the catalog API and the reader preview button will appear automatically.
                </p>
              ) }
              { book.pricing && (
                <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-2">
                  { typeof book.pricing.rent_price === "number" && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-normal text-slate-500">Rent</p>
                      <p className="mt-1 text-xl font-black text-slate-950">
                        { book.pricing.currency ?? "USD" } { book.pricing.rent_price.toFixed(2) }
                      </p>
                      { book.pricing.rent_duration_in_days && (
                        <p className="mt-1 text-sm font-semibold text-slate-600">{ book.pricing.rent_duration_in_days } days access</p>
                      ) }
                    </div>
                  ) }
                  { typeof book.pricing.lifetime_price === "number" && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-normal text-slate-500">Lifetime</p>
                      <p className="mt-1 text-xl font-black text-slate-950">
                        { book.pricing.currency ?? "USD" } { book.pricing.lifetime_price.toFixed(2) }
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">Permanent library access</p>
                    </div>
                  ) }
                </div>
              ) }
            </div>
          </section>

          { book.authorDescription && (
            <section className="mb-10 grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6">
              { book.authorImageUrl && (
                <Image
                  src={ book.authorImageUrl }
                  alt=""
                  width={ 96 }
                  height={ 96 }
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) }
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-normal text-red-700">About the author</p>
                { book.author && <h2 className="mb-2 text-2xl font-black text-slate-950">{ book.author }</h2> }
                <p className="max-w-4xl text-sm font-semibold leading-7 text-slate-600">{ book.authorDescription }</p>
              </div>
            </section>
          ) }

          <section className="mb-10">
            <SectionHeading
              eyebrow="More to explore"
              title="Recommended eBooks"
            />
            <BookGrid books={ recommendedBooks } />
          </section>
        </>
      ) }
    </>
  );
}
