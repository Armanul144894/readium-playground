"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "./booklyCatalog";
import type {
  DisplayBook,
  DisplayCategory,
  DisplayProfile
} from "./booklyCatalog";

const homeHref = "/" as const;

export const pageBackground: CSSProperties = {
  background:
    "radial-gradient(circle at top left, rgba(20, 184, 166, 0.16), transparent 34rem), linear-gradient(180deg, #ffffff 0, #f3f6f8 520px)"
};

export const AppShell = ({ children }: { children: ReactNode }) => (
  <main
    className="min-h-dvh bg-slate-100 px-4 py-5 text-slate-900 sm:px-6 lg:px-8"
    style={ pageBackground }
  >
    <div className="mx-auto w-full max-w-[1400px]">
      { children }
    </div>
  </main>
);

export const SiteHeader = () => (
  <header className="sticky top-0 z-20 mb-6 flex min-h-16 flex-col items-start gap-3 border-b border-slate-200/80 bg-white/85 py-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
    <Link
      className="inline-flex items-center gap-3 text-lg font-extrabold tracking-normal text-slate-950"
      href={ homeHref }
      aria-label="Bookly eBooks home"
    >
      <Image
        src="/images/bookly-logo.svg"
        alt=""
        width={ 42 }
        height={ 42 }
        priority
        className="h-10 w-10 rounded-lg"
      />
      <span>Bookly eBooks</span>
    </Link>
    <nav
      className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600"
      aria-label="Primary navigation"
    >
      <Link className="rounded-lg px-3 py-2 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700" href="/#categories">Categories</Link>
      <Link className="rounded-lg px-3 py-2 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700" href="/#authors">Authors</Link>
      <Link className="rounded-lg px-3 py-2 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700" href="/products">Products</Link>
    </nav>
  </header>
);

export const SiteFooter = () => (
  <footer className="mt-8 grid gap-5 border-t border-slate-200 py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
    <div>
      <h2 className="mb-2 text-lg font-extrabold text-slate-950">Bookly eBooks</h2>
      <p className="max-w-xl text-sm leading-6 text-slate-600">Curated digital books, clean discovery, and a reader-first browsing experience.</p>
    </div>
    <nav
      className="flex flex-wrap gap-3 text-sm font-bold text-slate-600"
      aria-label="Footer navigation"
    >
      <Link className="rounded-lg px-2 py-1 hover:bg-teal-50 hover:text-teal-700" href="/#categories">Categories</Link>
      <Link className="rounded-lg px-2 py-1 hover:bg-teal-50 hover:text-teal-700" href="/#authors">Authors</Link>
      <Link className="rounded-lg px-2 py-1 hover:bg-teal-50 hover:text-teal-700" href="/products">Products</Link>
      <Link className="rounded-lg px-2 py-1 hover:bg-teal-50 hover:text-teal-700" href={ homeHref }>Home</Link>
    </nav>
  </footer>
);

export const StatusMessage = ({
  children,
  tone = "default"
}: {
  children: ReactNode;
  tone?: "default" | "error";
}) => (
  <p
    className={[
      "mb-6 rounded-lg border px-4 py-3 text-sm font-semibold",
      tone === "error"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : "border-slate-200 bg-white text-slate-700"
    ].join(" ")}
    role={ tone === "error" ? "alert" : "status" }
  >
    { children }
  </p>
);

export const SectionHeading = ({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      { eyebrow && <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-slate-500">{ eyebrow }</p> }
      <h2 className="text-xl font-extrabold tracking-normal text-slate-950 sm:text-2xl">{ title }</h2>
    </div>
    { action }
  </div>
);

export const BookCover = ({
  src,
  title,
  priority = false,
  className = "",
  sizes = "(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 220px"
}: {
  src: string;
  title: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) => (
  <Image
    src={ src }
    alt=""
    fill
    sizes={ sizes }
    loading={ priority ? "eager" : "lazy" }
    aria-hidden="true"
    title={ title }
    className={ `object-contain drop-shadow-xl ${ className }` }
  />
);

export const BookMeta = ({ book }: { book: DisplayBook }) => {
  const price = formatPrice(book.price);

  if (!book.rating && !price && !book.discount) return null;

  return (
    <p className="flex flex-wrap gap-1.5 text-xs font-bold text-slate-700">
      { book.rating && <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Rating { book.rating.toFixed(1) }</span> }
      { price && <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">{ price }</span> }
      { Boolean(book.discount) && <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800">{ book.discount }% off</span> }
    </p>
  );
};

const normalizeProgressPercent = (value?: number): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;

  const percent = value > 0 && value <= 1 ? value * 100 : value;

  return Math.max(0, Math.min(100, Math.round(percent)));
};

const getStoredProgressPercent = (storageKey?: string): number | undefined => {
  if (!storageKey || typeof window === "undefined") return undefined;

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) return undefined;

    const locator = JSON.parse(rawValue) as { locations?: Record<string, unknown> };
    const locations = locator?.locations;
    const value = typeof locations?.totalProgression === "number"
      ? locations.totalProgression
      : typeof locations?.progression === "number"
        ? locations.progression
        : undefined;

    return typeof value === "number" ? normalizeProgressPercent(value) : undefined;
  } catch {
    return undefined;
  }
};

const useReadProgress = (book: DisplayBook): number => {
  const [progress, setProgress] = useState(() => normalizeProgressPercent(book.readProgress));

  useEffect(() => {
    const catalogProgress = normalizeProgressPercent(book.readProgress);
    const syncProgress = () => {
      setProgress(getStoredProgressPercent(book.progressStorageKey) ?? catalogProgress);
    };

    syncProgress();
    window.addEventListener("focus", syncProgress);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === book.progressStorageKey) syncProgress();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", syncProgress);
      window.removeEventListener("storage", handleStorage);
    };
  }, [book.progressStorageKey, book.readProgress]);

  return progress;
};

export const BookReadProgress = ({ book }: { book: DisplayBook }) => {
  const progress = useReadProgress(book);

  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between gap-3 text-[0.7rem] font-extrabold uppercase tracking-normal text-slate-500">
        <span>Read</span>
        <span className="text-teal-700">{ progress }%</span>
      </div>
      <div
        aria-label={ `${ progress }% read` }
        aria-valuemax={ 100 }
        aria-valuemin={ 0 }
        aria-valuenow={ progress }
        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
      >
        <span
          className="block h-full rounded-full bg-teal-600 transition-[width] duration-300"
          style={{ width: `${ progress }%` }}
        />
      </div>
    </div>
  );
};

export const BookCard = ({
  book,
  priority = false
}: {
  book: DisplayBook;
  priority?: boolean;
}) => (
  <Link
    className="group grid min-h-full grid-rows-[minmax(176px,auto)_minmax(128px,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white text-inherit shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:grid-rows-[minmax(220px,auto)_minmax(144px,1fr)]"
    href={ book.productUrl }
  >
    <figure
      className="relative aspect-[2/3] w-full"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${ book.color } 24%, #ffffff), #f1f5f9)`
      }}
    >
      <BookCover
        src={ book.cover }
        title={ book.title }
        priority={ priority }
      />
    </figure>
    <div className="flex min-w-0 flex-col p-3">
      <h3 className="mb-2 text-sm font-extrabold leading-snug tracking-normal text-slate-950 group-hover:text-teal-700 sm:text-base">{ book.title }</h3>
      { book.author && <p className="mb-3 text-sm leading-5 text-slate-600">{ book.author }</p> }
      { !book.author && book.subtitle && <p className="mb-3 text-sm leading-5 text-slate-600">{ book.subtitle }</p> }
      <div className="mt-auto">
        <BookReadProgress book={ book } />
        <BookMeta book={ book } />
      </div>
    </div>
  </Link>
);

export const BookGrid = ({ books }: { books: DisplayBook[] }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
    { books.map((book, index) => (
      <BookCard
        book={ book }
        key={ `${ book.id }-${ index }` }
        priority={ index < 2 }
      />
    )) }
  </div>
);

export const CategoryCard = ({ category }: { category: DisplayCategory }) => (
  <Link
    className="group grid min-h-20 grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:p-4"
    href={ category.href }
    style={{ borderLeftColor: category.color, borderLeftWidth: 4 }}
  >
    { category.icon && (
      <span
        className="grid h-10 w-10 place-items-center rounded-lg"
        style={{ background: `color-mix(in srgb, ${ category.color } 13%, #ffffff)` }}
      >
        <Image
          src={ category.icon }
          alt=""
          width={ 30 }
          height={ 30 }
          loading="lazy"
          aria-hidden="true"
        />
      </span>
    ) }
    <h3 className="text-sm font-extrabold leading-snug tracking-normal text-slate-800 group-hover:text-teal-700 sm:text-base">{ category.name }</h3>
  </Link>
);

export const AuthorCard = ({ author }: { author: DisplayProfile }) => (
  <Link
    className="group grid min-h-40 justify-items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700"
    href={ author.href }
  >
    { author.imageUrl && (
      <Image
        src={ author.imageUrl }
        alt=""
        width={ 76 }
        height={ 76 }
        loading="lazy"
        aria-hidden="true"
        className="h-[76px] w-[76px] rounded-full object-cover"
      />
    ) }
    <h3 className="text-sm font-extrabold leading-snug tracking-normal text-slate-800 group-hover:text-teal-700">{ author.name }</h3>
  </Link>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
    { children }
  </div>
);

