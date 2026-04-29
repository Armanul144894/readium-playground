"use client";

import Link from "next/link";

import "./home.css";

import {
  AppShell,
  AuthorCard,
  BookCard,
  BookCover,
  BookGrid,
  BookMeta,
  BookReadProgress,
  CategoryCard,
  EmptyState,
  SectionHeading,
  SiteFooter,
  SiteHeader,
  StatusMessage
} from "./BooklyUi";
import { DisplayBook, DisplayBookSection } from "./booklyCatalog";
import { useBooklyCatalog } from "./useBooklyCatalog";

const HeroBanner = ({ books }: { books: DisplayBook[] }) => {
  if (books.length === 0) return null;

  const [primaryBook, ...supportingBooks] = books;

  return (
    <section className="mb-10 grid min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-2xl lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.82fr)]">
      <div className="flex min-w-0 flex-col justify-center p-6 text-white sm:p-10 lg:p-14">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-normal text-teal-200">Online ebook store</p>
        <h1 className="mb-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">Bookly eBooks</h1>
        <p className="mb-7 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">Discover curated classics, author picks, featured deals, and reader-ready EPUBs in one polished digital shelf.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-200 px-5 font-extrabold text-slate-950 hover:bg-teal-100 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            href="/products"
          >
            Browse products
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 font-extrabold text-white hover:bg-white/10 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            href={ primaryBook.productUrl }
          >
            View featured
          </Link>
        </div>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_0.74fr] lg:grid-rows-2">
        <Link
          className="grid rounded-lg border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl transition hover:-translate-y-1 hover:border-teal-200/60 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-200 sm:col-span-2 lg:col-span-1 lg:row-span-2"
          href={ primaryBook.productUrl }
        >
          <figure className="relative min-h-[240px] lg:min-h-[280px]">
            <BookCover
              src={ primaryBook.cover }
              title={ primaryBook.title }
              priority
              sizes="(max-width: 1024px) 45vw, 300px"
            />
          </figure>
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-teal-200">Featured pick</p>
            <h2 className="mb-2 text-xl font-extrabold leading-tight text-white">{ primaryBook.title }</h2>
            { primaryBook.subtitle && <p className="text-sm leading-6 text-slate-200">{ primaryBook.subtitle }</p> }
          </div>
        </Link>
        { supportingBooks.slice(0, 2).map((book, index) => (
          <Link
            className="grid rounded-lg border border-white/15 bg-white/10 p-3 text-white backdrop-blur-xl transition hover:-translate-y-1 hover:border-teal-200/60 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            href={ book.productUrl }
            key={ `${ book.id }-${ index }` }
          >
            <figure className="relative min-h-36">
              <BookCover
                src={ book.cover }
                title={ book.title }
                sizes="160px"
              />
            </figure>
            <span className="text-sm font-extrabold leading-snug">{ book.title }</span>
          </Link>
        )) }
      </div>
    </section>
  );
};

const FeaturedBooks = ({ books }: { books: DisplayBook[] }) => {
  if (books.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionHeading title="Featured Deals" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.82fr)_minmax(220px,0.82fr)]">
        { books.map((book, index) => (
          <Link
            className="group grid min-h-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:grid-cols-[120px_minmax(0,1fr)] lg:first:grid-cols-[158px_minmax(0,1fr)]"
            href={ book.productUrl }
            key={ `${ book.id }-${ index }` }
          >
            <figure
              className="relative min-h-48"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${ book.color } 24%, #ffffff), #f1f5f9)`
              }}
            >
              <BookCover
                src={ book.cover }
                title={ book.title }
                priority={ index === 0 }
              />
            </figure>
            <div className="flex min-w-0 flex-col p-4">
              <h3 className="mb-2 text-lg font-extrabold leading-tight tracking-normal text-slate-950 group-hover:text-teal-700">{ book.title }</h3>
              { book.subtitle && <p className="mb-4 text-sm leading-6 text-slate-600">{ book.subtitle }</p> }
              <div className="mt-auto">
                <BookReadProgress book={ book } />
                <BookMeta book={ book } />
              </div>
            </div>
          </Link>
        )) }
      </div>
    </section>
  );
};

const BookSection = ({
  section,
  id
}: {
  section: DisplayBookSection;
  id?: string;
}) => (
  <section
    className="mb-10"
    id={ id }
  >
    <SectionHeading
      title={ section.title }
      action={ (
        <Link
          className="text-sm font-extrabold text-teal-700 hover:text-teal-900"
          href="/products"
        >
          View all
        </Link>
      ) }
    />
    <BookGrid books={ section.books } />
  </section>
);

export default function Home() {
  const { catalog, sections, isLoading, error } = useBooklyCatalog();
  const { banners, categories, authors, bookSections, moreProducts } = catalog;

  return (
    <AppShell>
      <SiteHeader />

      { isLoading && <StatusMessage>Loading Bookly catalog...</StatusMessage> }
      { error && <StatusMessage tone="error">{ error }</StatusMessage> }

      <HeroBanner books={ banners } />

      <section
        className="mb-10"
        id="categories"
      >
        <SectionHeading
          eyebrow="Browse shelves"
          title="Popular Categories"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          { categories.map((category) => (
            <CategoryCard
              category={ category }
              key={ category.id }
            />
          )) }
        </div>
      </section>

      { bookSections.slice(0, 4).map((section, index) => (
        <BookSection
          section={ section }
          key={ section.id }
          id={ index === 0 ? "trending" : undefined }
        />
      )) }

      <FeaturedBooks books={ banners } />

      <section
        className="mb-10"
        id="more-products"
      >
        <SectionHeading
          eyebrow="Shop the library"
          title="More Products"
          action={ (
            <Link
              className="text-sm font-extrabold text-teal-700 hover:text-teal-900"
              href="/products"
            >
              All products
            </Link>
          ) }
        />
        <BookGrid books={ moreProducts } />
      </section>

      <section
        className="mb-10"
        id="authors"
      >
        <SectionHeading
          eyebrow="Meet the writers"
          title="Top Authors"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          { authors.map((author) => (
            <AuthorCard
              author={ author }
              key={ author.id }
            />
          )) }
        </div>
      </section>

      { !isLoading && !error && sections.length === 0 && (
        <EmptyState>No books are available right now.</EmptyState>
      ) }

      <SiteFooter />
    </AppShell>
  );
}

