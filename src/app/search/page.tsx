import SearchPageClient from "./SearchPageClient";

type Props = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

const getSearchQuery = (value?: string | string[]): string => {
  if (Array.isArray(value)) return value[0] ?? "";

  return value ?? "";
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;

  return <SearchPageClient initialQuery={ getSearchQuery(params.q) } />;
}
