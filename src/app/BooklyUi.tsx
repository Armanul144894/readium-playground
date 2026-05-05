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

const headerCategoryLinks: Array<{ label: string; href: Route }> = [
  { label: "Novel", href: "/categories/novel" as Route },
  { label: "Stories", href: "/categories/stories" as Route },
  { label: "Poetry", href: "/categories/poetry" as Route },
  { label: "Drama", href: "/categories/drama" as Route },
  { label: "Children", href: "/categories/children-and-young" as Route },
  { label: "Essays", href: "/categories/essays" as Route },
  { label: "Classic Literature", href: "/categories/classic-literature" as Route }
];

export const pageBackground: CSSProperties = {
  background:
    "linear-gradient(180deg, #f8fafc 0, #f6f8f3 430px, #ffffff 100%)"
};

export const AppShell = ({ children }: { children: ReactNode }) => (
  <main
    className="min-h-dvh bg-slate-50 text-slate-900"
    style={pageBackground}
  >
    {children}
  </main>
);

export const SiteHeader = () => (
  <>
    <div className="border-b border-slate-200 bg-white/95 shadow-sm">
      <div className="mx-auto flex min-h-9 w-full max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs font-bold text-slate-600 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span>info@ebsbd.com</span>
          <span>+880 1914457857</span>
        </div>
        <div className="flex items-center gap-3">
          <Link className="text-red-700 hover:text-red-900 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600" href="/products">Subscription</Link>
          <span className="text-slate-400">Cart 0</span>
        </div>
      </div>
    </div>
    <header className="sticky top-0 z-20 mb-6 bg-white/95 shadow-sm backdrop-blur-xl">


      <div className="mx-auto grid w-full max-w-[1400px] gap-4 px-4 py-4 md:grid-cols-[auto_minmax(280px,1fr)_auto] md:items-center sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-3 text-lg font-black tracking-normal text-slate-950"
          href={homeHref}
          aria-label="Bookly eBooks home"
        >
          <Image
            src="/images/bookly_512.png"
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11 rounded-lg shadow-sm"
          />
          <span>
            <span className="block leading-tight">Bookly</span>
            <span className="block text-[0.68rem] font-extrabold uppercase tracking-normal text-red-700">Online bookshop</span>
          </span>
        </Link>
        <BookSearchBox />
        <nav
          className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-slate-700 md:justify-self-end"
          aria-label="Primary navigation"
        >
          <Link className="rounded-lg px-3 py-2 hover:bg-red-50 hover:text-red-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600" href="/#authors">Authors</Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-red-50 hover:text-red-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600" href="/products">Products</Link>
          <Link className="rounded-lg bg-slate-950 px-3 py-2 text-white hover:bg-red-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600" href="/products">Shop now</Link>
        </nav>
      </div>

      <div className="border-t border-slate-200">
        <nav
          className="mx-auto flex min-h-11 w-full max-w-[1400px] items-center gap-2 overflow-x-auto px-4 py-2 text-sm font-extrabold text-slate-700 sm:px-6 lg:px-8"
          aria-label="Category navigation"
        >
          <Link
            className="shrink-0 rounded-lg bg-red-700 px-3 py-2 text-white hover:bg-red-800 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
            href="/#categories"
          >
            Browse categories
          </Link>
          {headerCategoryLinks.map((item) => (
            <Link
              className="shrink-0 rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-red-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  </>
);


export const SiteFooter = () => (
  <footer className="mt-12 bg-slate-950 text-white">
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(150px,0.5fr))]">
        <div>
          <Link
            className="mb-4 inline-flex items-center gap-3 text-lg font-black text-white"
            href={homeHref}
            aria-label="Bookly eBooks home"
          >
            <Image
              src="/images/bookly_512.png"
              alt=""
              width={42}
              height={42}
              className="h-10 w-10 rounded-lg"
            />
            <span>
              <span className="block leading-tight">Bookly</span>
              <span className="block text-[0.68rem] font-extrabold uppercase tracking-normal text-red-300">Online bookshop</span>
            </span>
          </Link>
          <p className="max-w-md text-sm font-semibold leading-6 text-slate-300">
            Bengali classics, curated shelves, author collections, and digital book discovery in one clean storefront.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-black uppercase tracking-normal text-white">Browse</h2>
          <nav className="grid gap-2 text-sm font-semibold text-slate-300" aria-label="Footer browse navigation">
            <Link className="hover:text-red-300" href={homeHref}>Home</Link>
            <Link className="hover:text-red-300" href="/products">Products</Link>
            <Link className="hover:text-red-300" href="/#authors">Authors</Link>
            <Link className="hover:text-red-300" href="/search">Search</Link>
          </nav>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-black uppercase tracking-normal text-white">Categories</h2>
          <nav className="grid gap-2 text-sm font-semibold text-slate-300" aria-label="Footer category navigation">
            {headerCategoryLinks.slice(0, 5).map((item) => (
              <Link className="hover:text-red-300" href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-black uppercase tracking-normal text-white">Contact</h2>
          <div className="grid gap-2 text-sm font-semibold text-slate-300">
            <span>info@ebsbd.com</span>
            <span>+880 1914457857</span>
            <Link className="mt-2 inline-flex min-h-10 w-fit items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-black text-white hover:bg-red-500" href="/products">
              Shop now
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs font-bold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>Copyright 2026 Bookly eBooks. All rights reserved.</span>
        <span>Built for fast digital reading and clean discovery.</span>
      </div>
    </div>
  </footer>
);

const BookSearchBox = () => {
  const inputId = useId();
  const resultsId = `${inputId}-results`;
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { error, isLoading, query: trimmedQuery, results } = useBookSearch(query, { limit: 8 });
  const hasQuery = trimmedQuery.length > 0;
  const isOpen = isFocused && hasQuery;
  const searchResultsHref = `/search?q=${encodeURIComponent(trimmedQuery)}` as Route;

  return (
    <div className="relative w-full md:justify-self-stretch">
      <form
        action="/search"
        className="relative"
        role="search"
      >
        <label
          className="sr-only"
          htmlFor={inputId}
        >
          Search books and authors
        </label>
        <input
          aria-controls={isOpen ? resultsId : undefined}
          autoComplete="off"
          className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-28 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
          id={inputId}
          name="q"
          onBlur={() => window.setTimeout(() => setIsFocused(false), 140)}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search books or authors"
          type="search"
          value={query}
        />
        <button
          className="absolute right-1.5 top-1/2 inline-flex h-9 -translate-y-1/2 items-center justify-center rounded-md bg-red-700 px-4 text-xs font-extrabold text-white transition hover:bg-red-800 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-slate-200 disabled:text-slate-500"
          disabled={!hasQuery}
          type="submit"
        >
          Search
        </button>
      </form>

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(70vh,520px)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-2xl"
          id={resultsId}
        >
          {isLoading && <p className="px-3 py-3 text-sm font-bold text-slate-600">Searching...</p>}
          {error && <p className="px-3 py-3 text-sm font-bold text-rose-700" role="alert">{error}</p>}
          {!isLoading && !error && results.length === 0 && (
            <p className="px-3 py-3 text-sm font-bold text-slate-600">No results for &quot;{trimmedQuery}&quot;.</p>
          )}
          {results.length > 0 && (
            <>
              <SearchResultList
                compact
                onResultClick={() => setIsFocused(false)}
                results={results}
              />
              <Link
                className="mt-2 flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-extrabold text-red-700 hover:bg-red-50 hover:text-red-900 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
                href={searchResultsHref}
                onClick={() => setIsFocused(false)}
              >
                View all results
              </Link>
            </>
          )}
        </div>
      )}
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
      "mb-6 rounded-lg border px-4 py-3 text-sm font-semibold shadow-sm",
      tone === "error"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : "border-slate-200 bg-white text-slate-700"
    ].join(" ")}
    role={tone === "error" ? "alert" : "status"}
  >
    {children}
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
      {eyebrow && <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-red-700">{eyebrow}</p>}
      <h2 className="text-xl font-black tracking-normal text-slate-950 sm:text-2xl">{title}</h2>
    </div>
    {action}
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
    src={src}
    alt=""
    fill
    sizes={sizes}
    loading={priority ? "eager" : "lazy"}
    aria-hidden="true"
    title={title}
    className={`object-contain drop-shadow-xl ${className}`}
  />
);

export const BookMeta = ({ book }: { book: DisplayBook }) => {
  const price = formatPrice(book.price, book.currency);

  if (!book.rating && !price && !book.discount) return null;

  return (
    <p className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-slate-700">
      {book.rating && <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800">Rating {book.rating.toFixed(1)}</span>}
      {price && <span className="text-sm font-black text-red-700">{price}</span>}
      {Boolean(book.discount) && <span className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-red-700">{book.discount}% off</span>}
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
        <span className="text-red-700">{progress}%</span>
      </div>
      <div
        aria-label={`${progress}% read`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
      >
        <span
          className="block h-full rounded-full bg-red-600 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
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
  <ul className={compact ? "grid gap-1" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"}>
    {results.map((result) => {
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
        <li key={result.id}>
          <Link
            className={[
              "group grid min-w-0 items-center text-slate-900 transition hover:bg-red-50 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600",
              compact
                ? "min-h-[72px] grid-cols-[52px_minmax(0,1fr)_auto] gap-3 rounded-lg p-2"
                : "min-h-32 grid-cols-[74px_minmax(0,1fr)] gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
            ].join(" ")}
            href={result.href}
            onClick={onResultClick}
          >
            <span
              className={[
                "grid shrink-0 place-items-center overflow-hidden bg-slate-100 text-lg font-black text-red-800",
                frameClass
              ].join(" ")}
            >
              {result.image ? (
                <Image
                  src={result.image}
                  alt=""
                  width={compact ? 56 : 96}
                  height={compact ? 72 : 144}
                  loading="lazy"
                  aria-hidden="true"
                  className={`h-full w-full ${imageClass}`}
                />
              ) : (
                result.title.slice(0, 1).toUpperCase()
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold leading-snug tracking-normal text-slate-950 group-hover:text-red-700 sm:text-base">{result.title}</span>
              {result.subtitle && <span className="mt-1 block truncate text-sm font-semibold text-slate-600">{result.subtitle}</span>}
              {!compact && <span className="mt-2 inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-extrabold uppercase tracking-normal text-slate-600">{isAuthor ? "Author" : "Book"}</span>}
            </span>
            {compact && <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[0.68rem] font-extrabold uppercase tracking-normal text-slate-600">{isAuthor ? "Author" : "Book"}</span>}
          </Link>
        </li>
      );
    })}
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
    className="group grid min-h-full grid-rows-[210px_minmax(150px,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white text-inherit shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:grid-rows-[250px_minmax(156px,1fr)]"
    href={book.productUrl}
  >
    <figure
      className="relative w-full overflow-hidden"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${book.color} 34%, #ffffff), #f8fafc)`
      }}
    >
      {Boolean(book.discount) && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-red-700 px-2 py-1 text-[0.68rem] font-black text-white shadow-sm">
          {book.discount}% off
        </span>
      )}
      <BookCover
        className="p-5 transition duration-300 group-hover:scale-105"
        src={book.cover}
        title={book.title}
        priority={priority}
      />
    </figure>
    <div className="flex min-w-0 flex-col p-3">
      <p className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-normal text-slate-500">eBook</p>
      <h3 className="mb-2 text-sm font-black leading-snug tracking-normal text-slate-950 group-hover:text-red-700 sm:text-base">{book.title}</h3>
      {book.author && <p className="mb-3 text-sm font-semibold leading-5 text-slate-600">{book.author}</p>}
      {!book.author && book.subtitle && <p className="mb-3 text-sm leading-5 text-slate-600">{book.subtitle}</p>}
      <div className="mt-auto grid gap-3">
        <BookMeta book={book} />
        <span className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-900 transition group-hover:border-red-200 group-hover:bg-red-50 group-hover:text-red-700">
          View details
        </span>
      </div>
    </div>
  </Link>
);

export const BookGrid = ({ books }: { books: DisplayBook[] }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
    {books.map((book, index) => (
      <BookCard
        book={book}
        key={`${book.id}-${index}`}
        priority={index < 2}
      />
    ))}
  </div>
);

export const PopularCategoryCard = ({ category }: { category: DisplayCategory }) => (
  <Link
    className="group relative isolate min-h-32 overflow-hidden rounded-lg border border-slate-200 p-4 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:min-h-36"
    href={category.href}
    style={{
      background: `linear-gradient(110deg, color-mix(in srgb, ${category.color} 76%, #ffffff) 0%, #ffffff 100%)`
    }}
  >
    <h3 className="relative z-10 max-w-[74%] text-sm font-black leading-tight tracking-normal text-slate-950 md:text-lg">
      {category.name}
    </h3>
    {category.icon && (
      <Image
        src={category.icon}
        alt=""
        width={140}
        height={140}
        loading="lazy"
        aria-hidden="true"
        className="absolute bottom-[-8px] right-[-5px] z-0 h-[72%] w-auto max-w-[52%] object-contain drop-shadow-lg transition duration-300 group-hover:scale-105"
      />
    )}
  </Link>
);

export const CategoryCard = ({ category }: { category: DisplayCategory }) => (
  <Link
    className="group grid min-h-20 grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:p-4"
    href={category.href}
    style={{ borderLeftColor: category.color, borderLeftWidth: 4 }}
  >
    {category.icon && (
      <span
        className="grid h-10 w-10 place-items-center rounded-lg"
        style={{ background: `color-mix(in srgb, ${category.color} 13%, #ffffff)` }}
      >
        <Image
          src={category.icon}
          alt=""
          width={30}
          height={30}
          loading="lazy"
          aria-hidden="true"
        />
      </span>
    )}
    <h3 className="text-sm font-extrabold leading-snug tracking-normal text-slate-800 group-hover:text-red-700 sm:text-base">{category.name}</h3>
  </Link>
);

export const AuthorCard = ({ author }: { author: DisplayProfile }) => (
  <Link
    className="group grid min-h-40 justify-items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
    href={author.href}
  >
    {author.imageUrl && (
      <Image
        src={author.imageUrl}
        alt=""
        width={76}
        height={76}
        loading="lazy"
        aria-hidden="true"
        className="h-[76px] w-[76px] rounded-full object-cover"
      />
    )}
    <h3 className="text-sm font-extrabold leading-snug tracking-normal text-slate-800 group-hover:text-red-700">{author.name}</h3>
  </Link>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center font-semibold text-slate-600">
    {children}
  </div>
);
