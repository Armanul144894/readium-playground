"use client";

import { useState } from "react";

import {
  EmptyState,
  SearchResultList,
  SectionHeading,
  StatusMessage
} from "@/app/BooklyUi";
import { useBookSearch } from "@/app/useBookSearch";

type Props = {
  initialQuery: string;
};

export default function SearchPageClient({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const { error, isLoading, query: trimmedQuery, results } = useBookSearch(query, {
    debounceMs: 180
  });
  const hasQuery = trimmedQuery.length > 0;

  return (
    <>
      <section className="mb-10 rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-normal text-orange-700">Catalog search</p>
        <h1 className="mb-5 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">Search Bookly eBooks</h1>
        <form
          action="/search"
          className="flex max-w-3xl flex-col gap-3 sm:flex-row"
          role="search"
        >
          <label
            className="sr-only"
            htmlFor="search-page-query"
          >
            Search books and authors
          </label>
          <input
            autoComplete="off"
            className="min-h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-base font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            id="search-page-query"
            name="q"
            onChange={ (event) => setQuery(event.target.value) }
            placeholder="Title, author, or keyword"
            type="search"
            value={ query }
          />
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-5 font-extrabold text-white transition hover:bg-orange-600 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:bg-slate-200 disabled:text-slate-500"
            disabled={ !hasQuery }
            type="submit"
          >
            Search
          </button>
        </form>
      </section>

      <section className="mb-10">
        <SectionHeading
          eyebrow={ hasQuery ? `${ results.length } result${ results.length === 1 ? "" : "s" }` : "Search results" }
          title={ hasQuery ? `Results for "${ trimmedQuery }"` : "Search Results" }
        />

        { isLoading && <StatusMessage>Searching Bookly catalog...</StatusMessage> }
        { error && <StatusMessage tone="error">{ error }</StatusMessage> }
        { !hasQuery && <EmptyState>No search query yet.</EmptyState> }
        { !isLoading && !error && hasQuery && results.length === 0 && (
          <EmptyState>No matching books or authors were found.</EmptyState>
        ) }
        { results.length > 0 && <SearchResultList results={ results } /> }
      </section>
    </>
  );
}
