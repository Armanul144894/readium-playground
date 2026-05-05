"use client";

import Image from "next/image";
import Link from "next/link";

import {
  AuthorCard,
  BookCover,
  BookGrid,
  BookMeta,
  EmptyState,
  PopularCategoryCard,
  SectionHeading,
  StatusMessage
} from "./BooklyUi";
import { DisplayBook, DisplayBookSection, DisplayCategory } from "./booklyCatalog";
import { useBooklyCatalog } from "./useBooklyCatalog";

const uniqueSectionsByTitle = (sections: DisplayBookSection[]): DisplayBookSection[] => {
  const seen = new Set<string>();

  return sections.filter((section) => {
    const key = section.title.toLowerCase();
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const StorefrontHero = ({
  books,
  categories
}: {
  books: DisplayBook[];
  categories: DisplayCategory[];
}) => {
  if (books.length === 0) return null;

  const [primaryBook, ...supportingBooks] = books;

  return (
    <section className="mb-10 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
      <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black uppercase tracking-normal text-slate-950">Browse categories</h2>
          <Link className="text-xs font-black text-red-700 hover:text-red-900" href="/#categories">All</Link>
        </div>
        <nav className="grid gap-1" aria-label="Featured categories">
          { categories.slice(0, 7).map((category) => (
            <Link
              className="grid min-h-11 grid-cols-[30px_minmax(0,1fr)] items-center gap-3 rounded-lg px-2 text-sm font-extrabold text-slate-700 hover:bg-red-50 hover:text-red-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
              href={ category.href }
              key={ category.id }
            >
              { category.icon ? (
                <Image
                  src={ category.icon }
                  alt=""
                  width={ 28 }
                  height={ 28 }
                  aria-hidden="true"
                  className="h-7 w-7 object-contain"
                />
              ) : (
                <span
                  className="h-7 w-7 rounded-md"
                  style={{ backgroundColor: category.color }}
                />
              ) }
              <span className="truncate">{ category.name }</span>
            </Link>
          )) }
        </nav>
      </aside>

      <Link
        className="group grid min-h-[420px] overflow-hidden rounded-lg bg-slate-950 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:grid-cols-[minmax(0,1fr)_minmax(210px,0.64fr)]"
        href={ primaryBook.productUrl }
      >
        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-9 lg:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-red-200">Hot & New</p>
          <h1 className="mb-4 max-w-2xl text-4xl font-black leading-none tracking-normal text-white sm:text-5xl lg:text-6xl">
            { primaryBook.title }
          </h1>
          { primaryBook.author && <p className="mb-4 text-base font-bold text-slate-200">{ primaryBook.author }</p> }
          { primaryBook.subtitle && <p className="mb-5 max-w-xl text-sm leading-6 text-slate-300">{ primaryBook.subtitle }</p> }
          <div className="mb-6">
            <BookMeta book={ primaryBook } />
          </div>
          <span className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-black text-white transition group-hover:bg-red-500">
            View featured book
          </span>
        </div>
        <figure
          className="relative min-h-[280px] overflow-hidden sm:min-h-full"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${ primaryBook.color } 55%, #111827), #0f172a)`
          }}
        >
          <BookCover
            className="p-8 transition duration-300 group-hover:scale-105"
            src={ primaryBook.cover }
            title={ primaryBook.title }
            priority
            sizes="(max-width: 1024px) 55vw, 360px"
          />
        </figure>
      </Link>

      <aside className="grid gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-normal text-red-700">This week</p>
          <h2 className="mt-1 text-xl font-black leading-tight text-slate-950">Top picks</h2>
        </div>
        { supportingBooks.slice(0, 3).map((book, index) => (
          <Link
            className="group grid min-h-32 grid-cols-[82px_minmax(0,1fr)] gap-3 overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600"
            href={ book.productUrl }
            key={ `${ book.id }-${ index }` }
          >
            <figure
              className="relative overflow-hidden rounded-md"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${ book.color } 34%, #ffffff), #f8fafc)`
              }}
            >
              <BookCover
                className="p-2"
                src={ book.cover }
                title={ book.title }
                sizes="96px"
              />
            </figure>
            <div className="min-w-0 self-center">
              <h3 className="mb-2 text-sm font-black leading-snug text-slate-950 group-hover:text-red-700">{ book.title }</h3>
              { book.author && <p className="mb-2 truncate text-xs font-semibold text-slate-600">{ book.author }</p> }
              <BookMeta book={ book } />
            </div>
          </Link>
        )) }
      </aside>
    </section>
  );
};

const FeaturedBooks = ({ books }: { books: DisplayBook[] }) => {
  if (books.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionHeading
        eyebrow="Featured deals"
        title="Editor Picks"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        { books.slice(0, 3).map((book, index) => (
          <Link
            className="group grid min-h-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:grid-cols-[132px_minmax(0,1fr)]"
            href={ book.productUrl }
            key={ `${ book.id }-${ index }` }
          >
            <figure
              className="relative min-h-48"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${ book.color } 34%, #ffffff), #f8fafc)`
              }}
            >
              <BookCover
                className="p-4"
                src={ book.cover }
                title={ book.title }
                priority={ index === 0 }
              />
            </figure>
            <div className="flex min-w-0 flex-col p-4">
              <p className="mb-2 text-[0.68rem] font-black uppercase tracking-normal text-red-700">Featured</p>
              <h3 className="mb-2 text-lg font-black leading-tight tracking-normal text-slate-950 group-hover:text-red-700">{ book.title }</h3>
              { book.author && <p className="mb-3 text-sm font-semibold leading-6 text-slate-600">{ book.author }</p> }
              { book.subtitle && <p className="mb-4 text-sm leading-6 text-slate-600">{ book.subtitle }</p> }
              <div className="mt-auto">
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
      eyebrow="Bookshop shelf"
      title={ section.title }
      action={ (
        <Link
          className="text-sm font-black text-red-700 hover:text-red-900"
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
  const { banners, popularCategories, discoverBookSections, authors, bookSections, moreProducts } = catalog;
  const heroBooks = banners.length > 0 ? banners : moreProducts.slice(0, 4);
  const shelfSections = uniqueSectionsByTitle([...discoverBookSections, ...bookSections]).slice(0, 6);
  const editorPicks = bookSections.find((section) => /best|recommended/i.test(section.title))?.books ?? banners;

  return (
    <>
      { isLoading && <StatusMessage>Loading Bookly catalog...</StatusMessage> }
      { error && <StatusMessage tone="error">{ error }</StatusMessage> }

      <StorefrontHero
        books={ heroBooks }
        categories={ popularCategories }
      />

      <section
        className="mb-10"
        id="categories"
      >
        <SectionHeading
          eyebrow="Browse shelves"
          title="Popular Categories"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          { popularCategories.map((category) => (
            <PopularCategoryCard
              category={ category }
              key={ category.id }
            />
          )) }
        </div>
      </section>

      { shelfSections.map((section, index) => (
        <BookSection
          section={ section }
          key={ section.id }
          id={ index === 0 ? "trending" : undefined }
        />
      )) }

      <FeaturedBooks books={ editorPicks } />

      <section
        className="mb-10"
        id="more-products"
      >
        <SectionHeading
          eyebrow="Shop the library"
          title="More Products"
          action={ (
            <Link
              className="text-sm font-black text-red-700 hover:text-red-900"
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9">
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
    </>
  );
}
