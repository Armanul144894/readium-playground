"use client";

import { useEffect, useId, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "./booklyCatalog";
import type {
  DisplayBook,
  DisplayCategory,
  DisplayProfile,
  DisplaySearchResult
} from "./booklyCatalog";
import { useBookSearch } from "./useBookSearch";

const homeHref = "/" as const;

export const pageBackground: CSSProperties = {
  background:
    "radial-gradient(circle at top left, rgba(255, 152, 0, 0.2), transparent 34rem), linear-gradient(180deg, #fff8ed 0, #f7f3ec 520px)"
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
  <header className="sticky top-0 z-20 mb-6 grid min-h-16 gap-3 border-b border-slate-200/80 bg-white/85 py-3 backdrop-blur-xl md:grid-cols-[auto_minmax(260px,430px)_auto] md:items-center">
    <Link
      className="inline-flex items-center gap-3 text-lg font-extrabold tracking-normal text-slate-950"
      href={ homeHref }
      aria-label="Bookly eBooks home"
    >
      <Image
        src="/images/bookly_512.png"
        alt=""
        width={ 42 }
        height={ 42 }
        priority
        className="h-11 w-11 rounded-xl shadow-sm"
      />
      <span>Bookly eBooks</span>
    </Link>
    <BookSearchBox />
    <nav
      className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600 md:justify-self-end"
      aria-label="Primary navigation"
    >
      <Link className="rounded-lg px-3 py-2 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600" href="/#categories">Categories</Link>
      <Link className="rounded-lg px-3 py-2 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600" href="/#authors">Authors</Link>
      <Link className="rounded-lg px-3 py-2 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600" href="/products">Products</Link>
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
      <Link className="rounded-lg px-2 py-1 hover:bg-orange-50 hover:text-orange-700" href="/#categories">Categories</Link>
      <Link className="rounded-lg px-2 py-1 hover:bg-orange-50 hover:text-orange-700" href="/#authors">Authors</Link>
      <Link className="rounded-lg px-2 py-1 hover:bg-orange-50 hover:text-orange-700" href="/products">Products</Link>
      <Link className="rounded-lg px-2 py-1 hover:bg-orange-50 hover:text-orange-700" href={ homeHref }>Home</Link>
    </nav>
  </footer>
);

const BookSearchBox = () => {
  const inputId = useId();
  const resultsId = `${ inputId }-results`;
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { error, isLoading, query: trimmedQuery, results } = useBookSearch(query, { limit: 8 });
  const hasQuery = trimmedQuery.length > 0;
  const isOpen = isFocused && hasQuery;
  const searchResultsHref = `/search?q=${ encodeURIComponent(trimmedQuery) }` as Route;

  return (
    <div className="relative w-full md:justify-self-stretch">
      <form
        action="/search"
        className="relative"
        role="search"
      >
        <label
          className="sr-only"
          htmlFor={ inputId }
        >
          Search books and authors
        </label>
        <input
          aria-controls={ isOpen ? resultsId : undefined }
          autoComplete="off"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-24 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          id={ inputId }
          name="q"
          onBlur={ () => window.setTimeout(() => setIsFocused(false), 140) }
          onChange={ (event) => setQuery(event.target.value) }
          onFocus={ () => setIsFocused(true) }
          placeholder="Search books or authors"
          type="search"
          value={ query }
        />
        <button
          className="absolute right-1.5 top-1/2 inline-flex h-8 -translate-y-1/2 items-center justify-center rounded-md bg-slate-950 px-3 text-xs font-extrabold text-white transition hover:bg-orange-600 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:bg-slate-200 disabled:text-slate-500"
          disabled={ !hasQuery }
          type="submit"
        >
          Search
        </button>
      </form>

      { isOpen && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(70vh,520px)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-2xl"
          id={ resultsId }
        >
          { isLoading && <p className="px-3 py-3 text-sm font-bold text-slate-600">Searching...</p> }
          { error && <p className="px-3 py-3 text-sm font-bold text-rose-700" role="alert">{ error }</p> }
          { !isLoading && !error && results.length === 0 && (
            <p className="px-3 py-3 text-sm font-bold text-slate-600">No results for &quot;{ trimmedQuery }&quot;.</p>
          ) }
          { results.length > 0 && (
            <>
              <SearchResultList
                compact
                onResultClick={ () => setIsFocused(false) }
                results={ results }
              />
              <Link
                className="mt-2 flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-extrabold text-orange-700 hover:bg-orange-50 hover:text-orange-900 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                href={ searchResultsHref }
                onClick={ () => setIsFocused(false) }
              >
                View all results
              </Link>
            </>
          ) }
        </div>
      ) }
    </div>
  );
};

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
        <span className="text-orange-700">{ progress }%</span>
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
          className="block h-full rounded-full bg-orange-500 transition-[width] duration-300"
          style={{ width: `${ progress }%` }}
        />
      </div>
    </div>
  );
};

export const SearchResultList = ({
  compact = false,
  onResultClick,
  results
}: {
  compact?: boolean;
  onResultClick?: () => void;
  results: DisplaySearchResult[];
}) => (
  <ul className={ compact ? "grid gap-1" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" }>
    { results.map((result) => {
      const isAuthor = result.type === "author";
      const frameClass = compact
        ? isAuthor
          ? "h-12 w-12 rounded-full"
          : "h-14 w-12 rounded-md"
        : isAuthor
          ? "h-16 w-16 rounded-full"
          : "h-24 w-16 rounded-md";
      const imageClass = isAuthor ? "object-cover" : "object-contain";

      return (
        <li key={ result.id }>
          <Link
            className={[
              "group grid min-w-0 items-center text-slate-900 transition hover:bg-orange-50 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600",
              compact
                ? "min-h-[72px] grid-cols-[52px_minmax(0,1fr)_auto] gap-3 rounded-lg p-2"
                : "min-h-32 grid-cols-[74px_minmax(0,1fr)] gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            ].join(" ") }
            href={ result.href }
            onClick={ onResultClick }
          >
            <span
              className={[
                "grid shrink-0 place-items-center overflow-hidden bg-slate-100 text-lg font-black text-orange-800",
                frameClass
              ].join(" ") }
            >
              { result.image ? (
                <Image
                  src={ result.image }
                  alt=""
                  width={ compact ? 56 : 96 }
                  height={ compact ? 72 : 144 }
                  loading="lazy"
                  aria-hidden="true"
                  className={ `h-full w-full ${ imageClass }` }
                />
              ) : (
                result.title.slice(0, 1).toUpperCase()
              ) }
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold leading-snug tracking-normal text-slate-950 group-hover:text-orange-700 sm:text-base">{ result.title }</span>
              { result.subtitle && <span className="mt-1 block truncate text-sm font-semibold text-slate-600">{ result.subtitle }</span> }
              { !compact && <span className="mt-2 inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-extrabold uppercase tracking-normal text-slate-600">{ isAuthor ? "Author" : "Book" }</span> }
            </span>
            { compact && <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[0.68rem] font-extrabold uppercase tracking-normal text-slate-600">{ isAuthor ? "Author" : "Book" }</span> }
          </Link>
        </li>
      );
    }) }
  </ul>
);

export const BookCard = ({
  book,
  priority = false
}: {
  book: DisplayBook;
  priority?: boolean;
}) => (
  <Link
    className="group grid min-h-full grid-rows-[minmax(176px,auto)_minmax(128px,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white text-inherit shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:grid-rows-[minmax(220px,auto)_minmax(144px,1fr)]"
    href={ book.productUrl }
  >
    <figure
      className="relative w-full"
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
      <h3 className="mb-2 text-sm font-extrabold leading-snug tracking-normal text-slate-950 group-hover:text-orange-700 sm:text-base">{ book.title }</h3>
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
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
    { books.map((book, index) => (
      <BookCard
        book={ book }
        key={ `${ book.id }-${ index }` }
        priority={ index < 2 }
      />
    )) }
  </div>
);

export const PopularCategoryCard = ({ category }: { category: DisplayCategory }) => (
  <Link
    className="group relative isolate min-h-36 overflow-hidden rounded-lg p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:min-h-40"
    href={ category.href }
    style={{
      background: `linear-gradient(110deg, ${ category.color } 0%, color-mix(in srgb, ${ category.color } 54%, #ffffff) 63%, color-mix(in srgb, ${ category.color } 16%, #ffffff) 100%)`
    }}
  >
    <span className="absolute inset-0 bg-gradient-to-r from-black/24 via-black/5 to-white/12" />
    <h3 className="relative z-10 max-w-[76%] md:text-xl font-black leading-tight tracking-normal text-white drop-shadow-sm text-sm">
      { category.name }
    </h3>
    { category.icon && (
      <Image
        src={ category.icon }
        alt=""
        width={ 140 }
        height={ 140 }
        loading="lazy"
        aria-hidden="true"
        className="absolute bottom-[-8px] right-[-5px] z-0 h-[70%] w-auto max-w-[50%] object-contain drop-shadow-lg transition duration-300 group-hover:scale-105"
      />
    ) }
  </Link>
);

export const CategoryCard = ({ category }: { category: DisplayCategory }) => (
  <Link
    className="group grid min-h-20 grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:p-4"
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
    <h3 className="text-sm font-extrabold leading-snug tracking-normal text-slate-800 group-hover:text-orange-700 sm:text-base">{ category.name }</h3>
  </Link>
);

export const AuthorCard = ({ author }: { author: DisplayProfile }) => (
  <Link
    className="group grid min-h-40 justify-items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600"
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
    <h3 className="text-sm font-extrabold leading-snug tracking-normal text-slate-800 group-hover:text-orange-700">{ author.name }</h3>
  </Link>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
    { children }
  </div>
);
