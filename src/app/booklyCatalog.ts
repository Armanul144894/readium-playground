import type { Route } from "next";

export const EBOOKS_API_URL = "https://mh15-cdn.b-cdn.net/Bookly/ebooks.json";
export const PROXIED_EBOOKS_API_URL = `/api/proxy?url=${ encodeURIComponent(EBOOKS_API_URL) }`;
export const DISCOVER_API_URL = "https://mh15-cdn.b-cdn.net/Bookly/discover.json";
export const PROXIED_DISCOVER_API_URL = `/api/proxy?url=${ encodeURIComponent(DISCOVER_API_URL) }`;
export const BOOK_SEARCH_API_URL = "https://book-search-tniii.bunny.run/";
export const PUBLICATION_SERVER_URL = "https://publication-server.readium.org/webpub";

const KNOWN_EPUB_PATHS_BY_ID: Record<string, string> = {
  "2": "https://www.gutenberg.org/ebooks/3836.epub.images",
  "4": "https://www.gutenberg.org/ebooks/1513.epub.images",
  "5": "https://www.gutenberg.org/ebooks/76.epub.images",
  "6": "https://www.gutenberg.org/ebooks/55.epub.images",
  "7": "https://www.gutenberg.org/ebooks/2641.epub.images",
  "8": "https://www.gutenberg.org/ebooks/43.epub.images",
  "10": "https://standardebooks.org/ebooks/carolyn-keene/the-secret-of-the-old-clock/downloads/carolyn-keene_the-secret-of-the-old-clock.epub",
  "11": "https://standardebooks.org/ebooks/hugh-lofting/the-story-of-doctor-dolittle/downloads/hugh-lofting_the-story-of-doctor-dolittle.epub",
  "12": "https://standardebooks.org/ebooks/arthur-ransome/swallows-and-amazons/downloads/arthur-ransome_swallows-and-amazons.epub",
  "13": "https://standardebooks.org/ebooks/hugh-lofting/the-voyages-of-doctor-dolittle/downloads/hugh-lofting_the-voyages-of-doctor-dolittle.epub",
  "14": "https://www.gutenberg.org/ebooks/145.epub.images"
};

export type LocalizedText = {
  en?: string;
  bn?: string;
  ar?: string;
  [locale: string]: string | undefined;
};

export type BooklyAuthor = {
  id?: string;
  name?: LocalizedText;
};

export type BooklyBook = {
  id?: string;
  title?: LocalizedText;
  subtitle?: LocalizedText;
  author?: BooklyAuthor;
  imagePath?: string;
  epubPath?: string;
  coverColor?: string;
  color?: string;
  rating?: number;
  price?: number;
  discount?: number;
  progress?: number;
  readProgress?: number;
  readPercentage?: number;
  readingProgress?: number;
};

export type BooklyCategory = {
  id?: string;
  name?: LocalizedText;
  sort_name?: LocalizedText;
  icon?: string;
  color?: string;
};

export type BooklyProfile = {
  id?: string;
  name?: LocalizedText;
  imageUrl?: string;
};

export type BooklyItem = BooklyBook | BooklyCategory | BooklyProfile;

export type BooklySection = {
  id?: string;
  type?: string;
  name?: LocalizedText;
  items?: BooklyItem[];
};

type BooklyResponse = {
  success?: boolean;
  data?: BooklySection[];
};

type BookSearchType = "author" | "book";

type BookSearchAuthorValue = LocalizedText | BooklyAuthor;

type BookSearchItem = {
  id?: string | number;
  name?: LocalizedText;
  imagePath?: string;
  imageUrl?: string;
  author?: BookSearchAuthorValue;
  searchType?: string;
};

type BookSearchResponse = {
  success?: boolean;
  query?: string;
  data?: BookSearchItem[];
};

export type DisplayBook = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author?: string;
  cover: string;
  readerUrl?: string;
  progressStorageKey?: string;
  readProgress: number;
  productUrl: Route;
  color: string;
  rating?: number;
  price?: number;
  discount?: number;
};

export type DisplayCategory = {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  color: string;
  href: Route;
};

export type DisplayProfile = {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  href: Route;
};

export type DisplayBookSection = {
  id: string;
  title: string;
  books: DisplayBook[];
};

export type DisplaySearchResult = {
  id: string;
  slug: string;
  type: BookSearchType;
  title: string;
  subtitle?: string;
  image?: string;
  href: Route;
};

export type BooklyCatalogModel = {
  banners: DisplayBook[];
  categories: DisplayCategory[];
  popularCategories: DisplayCategory[];
  discoverBookSections: DisplayBookSection[];
  authors: DisplayProfile[];
  bookSections: DisplayBookSection[];
  moreProducts: DisplayBook[];
  booksByCategorySlug: Map<string, DisplayBook[]>;
  booksByAuthorSlug: Map<string, DisplayBook[]>;
};

export const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === "object" && value !== null
);

export const getLocalizedText = (value?: LocalizedText): string => {
  if (!value) return "";

  return value.en
    ?? Object.values(value).find((entry): entry is string => typeof entry === "string" && entry.length > 0)
    ?? "";
};

export const isBookItem = (item: BooklyItem): item is BooklyBook => (
  isRecord(item) && ("title" in item || "imagePath" in item || "epubPath" in item)
);

export const isCategoryItem = (item: BooklyItem): item is BooklyCategory => (
  isRecord(item) && "icon" in item && "name" in item
);

export const isProfileItem = (item: BooklyItem): item is BooklyProfile => (
  isRecord(item) && "imageUrl" in item && "name" in item
);

export const parseBooklyResponse = (payload: unknown): BooklySection[] => {
  if (!isRecord(payload)) {
    throw new Error("The ebook API returned an unexpected response.");
  }

  const response = payload as BooklyResponse;

  if (response.success === false || !Array.isArray(response.data)) {
    throw new Error("The ebook API did not return a usable catalog.");
  }

  return response.data.filter((section): section is BooklySection => (
    isRecord(section) && Array.isArray(section.items)
  ));
};

const isBookSearchType = (value?: string): value is BookSearchType => (
  value === "author" || value === "book"
);

const getSearchAuthorName = (value?: BookSearchAuthorValue): string => {
  if (!value) return "";

  if (isRecord(value) && "name" in value) {
    return getLocalizedText((value as BooklyAuthor).name);
  }

  return getLocalizedText(value as LocalizedText);
};

export const parseBookSearchResponse = (payload: unknown): BookSearchItem[] => {
  if (!isRecord(payload)) {
    throw new Error("The book search API returned an unexpected response.");
  }

  const response = payload as BookSearchResponse;

  if (response.success === false || !Array.isArray(response.data)) {
    throw new Error("The book search API did not return usable results.");
  }

  return response.data.filter((item): item is BookSearchItem => (
    isRecord(item) && isBookSearchType(item.searchType) && isRecord(item.name)
  ));
};

export const toCssColor = (value?: string, fallback = "#edf1f5"): string => {
  if (!value) return fallback;

  const rawValue = value.replace(/^0x/i, "").replace(/^#/, "");
  const rgbValue = rawValue.length === 8 ? rawValue.slice(2) : rawValue;

  return /^[0-9a-f]{6}$/i.test(rgbValue) ? `#${ rgbValue }` : fallback;
};

export const formatPrice = (price?: number): string | null => (
  typeof price === "number" ? `$${ price.toFixed(2) }` : null
);

export const slugify = (value: string): string => {
  const slug = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "bookly-item";
};

const encodeBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const createReaderUrl = (epubPath: string, isManifestEnabled: boolean): string => {
  if (!isManifestEnabled) {
    return epubPath;
  }

  const manifestUrl = `${ PUBLICATION_SERVER_URL }/${ encodeBase64Url(epubPath) }/manifest.json`;

  return `/read/manifest/${ encodeURIComponent(manifestUrl) }`;
};

const getProgressStorageKey = (readerUrl?: string): string | undefined => {
  const manifestReaderPrefix = "/read/manifest/";

  if (!readerUrl?.startsWith(manifestReaderPrefix)) return undefined;

  try {
    const manifestUrl = decodeURIComponent(readerUrl.slice(manifestReaderPrefix.length));

    return `${ manifestUrl }-current-location`;
  } catch {
    return undefined;
  }
};

const normalizeReadProgress = (value?: number): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;

  const percent = value > 0 && value <= 1 ? value * 100 : value;

  return Math.max(0, Math.min(100, Math.round(percent)));
};

const getBookReadProgress = (book: BooklyBook): number => (
  normalizeReadProgress(book.readProgress)
  ?? normalizeReadProgress(book.readPercentage)
  ?? normalizeReadProgress(book.readingProgress)
  ?? normalizeReadProgress(book.progress)
  ?? 0
);

const getGutenbergEpubFromCover = (imagePath?: string): string | undefined => {
  const gutenbergId = imagePath?.match(/gutenberg\.org\/cache\/epub\/(\d+)\//)?.[1];

  return gutenbergId ? `https://www.gutenberg.org/ebooks/${ gutenbergId }.epub.images` : undefined;
};

const getBookUrl = (
  book: BooklyBook,
  epubPathsById: Map<string, string>,
  isManifestEnabled: boolean
): string | undefined => {
  const epubPath = book.epubPath
    ?? (book.id ? epubPathsById.get(book.id) ?? KNOWN_EPUB_PATHS_BY_ID[book.id] : undefined)
    ?? getGutenbergEpubFromCover(book.imagePath);

  return epubPath ? createReaderUrl(epubPath, isManifestEnabled) : undefined;
};

const toProductRoute = (slug: string): Route => `/ebooks/${ encodeURIComponent(slug) }` as Route;

const toSearchResultRoute = (type: BookSearchType, key: string): Route => (
  type === "author"
    ? `/authors/${ encodeURIComponent(key) }`
    : `/ebooks/${ encodeURIComponent(key) }`
) as Route;

const toDisplayBook = (
  book: BooklyBook,
  epubPathsById: Map<string, string>,
  isManifestEnabled: boolean
): DisplayBook | null => {
  const title = getLocalizedText(book.title);
  const cover = book.imagePath;

  if (!title || !cover) return null;

  const slug = slugify(title);
  const readerUrl = getBookUrl(book, epubPathsById, isManifestEnabled);

  return {
    id: book.id ?? `${ title }-${ cover }`,
    slug,
    title,
    subtitle: getLocalizedText(book.subtitle) || undefined,
    author: getLocalizedText(book.author?.name) || undefined,
    cover,
    readerUrl,
    progressStorageKey: getProgressStorageKey(readerUrl),
    readProgress: getBookReadProgress(book),
    productUrl: toProductRoute(slug),
    color: toCssColor(book.coverColor ?? book.color),
    rating: book.rating,
    price: book.price,
    discount: book.discount
  };
};

const toDisplaySearchResult = (item: BookSearchItem): DisplaySearchResult | null => {
  if (!isBookSearchType(item.searchType)) return null;

  const title = getLocalizedText(item.name);
  if (!title) return null;

  const slug = slugify(title);
  const routeKey = item.id === undefined || item.id === null ? slug : String(item.id);

  return {
    id: `${ item.searchType }-${ routeKey }`,
    slug,
    type: item.searchType,
    title,
    subtitle: item.searchType === "book" ? getSearchAuthorName(item.author) || undefined : undefined,
    image: item.searchType === "author" ? item.imageUrl : item.imagePath,
    href: toSearchResultRoute(item.searchType, routeKey)
  };
};

const createEpubPathMap = (sections: BooklySection[]): Map<string, string> => {
  const epubPathsById = new Map<string, string>();

  sections.forEach((section) => {
    section.items?.forEach((item) => {
      if (isBookItem(item) && item.id && item.epubPath) {
        epubPathsById.set(item.id, item.epubPath);
      }
    });
  });

  return epubPathsById;
};

const uniqueBooks = (books: DisplayBook[]): DisplayBook[] => {
  const unique = new Map<string, DisplayBook>();

  books.forEach((book) => {
    if (!unique.has(book.slug)) {
      unique.set(book.slug, book);
    }
  });

  return [...unique.values()];
};

const appendBook = (map: Map<string, DisplayBook[]>, key: string | undefined, book: DisplayBook) => {
  if (!key) return;

  const existing = map.get(key) ?? [];

  if (!existing.some((item) => item.id === book.id)) {
    map.set(key, [...existing, book]);
  }
};

const normalizeName = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const findAuthorSlugForBook = (authorName: string | undefined, authors: DisplayProfile[]): string | undefined => {
  if (!authorName) return undefined;

  const normalizedBookAuthor = normalizeName(authorName);
  const exactMatch = authors.find((author) => normalizeName(author.name) === normalizedBookAuthor);

  if (exactMatch) return exactMatch.slug;

  const bookAuthorTokens = new Set(normalizedBookAuthor.split(" ").filter(Boolean));
  const tokenMatch = authors.find((author) => {
    const authorTokens = normalizeName(author.name).split(" ").filter(Boolean);

    return authorTokens.length > 0 && authorTokens.every((token) => bookAuthorTokens.has(token));
  });

  return tokenMatch?.slug;
};

const createDisplayCategories = (sections: BooklySection[]): DisplayCategory[] => (
  sections
    .find((section) => section.type === "book_category_list")
    ?.items
    ?.filter(isCategoryItem)
    .map((item) => {
      const id = item.id ?? getLocalizedText(item.name);
      const name = getLocalizedText(item.name);
      const slug = slugify(name);

      return {
        id,
        slug,
        name,
        icon: item.icon,
        color: toCssColor(item.color),
        href: `/categories/${ encodeURIComponent(slug) }` as Route
      };
    })
    .filter((item) => item.name) ?? []
);

const createDiscoverBookSections = (
  sections: BooklySection[],
  epubPathsById: Map<string, string>,
  isManifestEnabled: boolean
): DisplayBookSection[] => (
  sections
    .filter((section) => section.type !== "book_category_list")
    .filter((section) => section.type?.includes("book_list") || section.items?.some(isBookItem))
    .map((section, index) => {
      const books = section.items
        ?.filter(isBookItem)
        .map((item) => toDisplayBook(item, epubPathsById, isManifestEnabled))
        .filter((item): item is DisplayBook => item !== null) ?? [];

      return {
        id: `discover-${ section.type ?? "book-section" }-${ section.id ?? index }`,
        title: getLocalizedText(section.name),
        books
      };
    })
    .filter((section) => section.title && section.books.length > 0)
);

export const createBooklyCatalogModel = (
  sections: BooklySection[],
  isManifestEnabled: boolean,
  discoverSections: BooklySection[] = []
): BooklyCatalogModel => {
  const epubPathsById = createEpubPathMap([...sections, ...discoverSections]);

  const banners = sections
    .find((section) => section.type === "banner_list")
    ?.items
    ?.filter(isBookItem)
    .map((item) => toDisplayBook(item, epubPathsById, isManifestEnabled))
    .filter((item): item is DisplayBook => item !== null) ?? [];

  const categories = createDisplayCategories(sections);
  const discoverCategories = createDisplayCategories(discoverSections);
  const popularCategories = discoverCategories.length > 0 ? discoverCategories : categories;

  const authors = sections
    .find((section) => section.type === "author_list")
    ?.items
    ?.filter(isProfileItem)
    .map((item) => {
      const id = item.id ?? getLocalizedText(item.name);
      const name = getLocalizedText(item.name);
      const slug = slugify(name);

      return {
        id,
        slug,
        name,
        imageUrl: item.imageUrl,
        href: `/authors/${ encodeURIComponent(slug) }` as Route
      };
    })
    .filter((item) => item.name) ?? [];

  const categorySlugsById = new Map(categories.map((category) => [category.id, category.slug]));
  const categorySlugsByName = new Set(categories.map((category) => category.slug));
  const booksByCategorySlug = new Map<string, DisplayBook[]>();
  const booksByAuthorSlug = new Map<string, DisplayBook[]>();

  const bookSections = sections
    .filter((section) => section.type?.includes("book_list") || section.type === "top_of_the_month")
    .filter((section) => section.type !== "continue_reading_book_list")
    .map((section, index) => {
      const books = section.items
        ?.filter(isBookItem)
        .map((item) => toDisplayBook(item, epubPathsById, isManifestEnabled))
        .filter((item): item is DisplayBook => item !== null) ?? [];

      const sectionTitle = getLocalizedText(section.name);
      const sectionSlug = slugify(sectionTitle);
      const categorySlug = categorySlugsByName.has(sectionSlug)
        ? sectionSlug
        : section.id
          ? categorySlugsById.get(section.id)
          : undefined;

      books.forEach((book) => {
        appendBook(booksByCategorySlug, categorySlug, book);
        appendBook(booksByAuthorSlug, findAuthorSlugForBook(book.author, authors), book);
      });

      return {
        id: `${ section.type ?? "book-section" }-${ section.id ?? index }`,
        title: sectionTitle,
        books
      };
    })
    .filter((section) => section.title && section.books.length > 0);

  const discoverBookSections = createDiscoverBookSections(discoverSections, epubPathsById, isManifestEnabled);

  const moreProducts = uniqueBooks([
    ...banners,
    ...bookSections.flatMap((section) => section.books),
    ...discoverBookSections.flatMap((section) => section.books)
  ]);

  return {
    banners,
    categories,
    popularCategories,
    discoverBookSections,
    authors,
    bookSections,
    moreProducts,
    booksByCategorySlug,
    booksByAuthorSlug
  };
};

export const fetchBooklySections = async (signal?: AbortSignal): Promise<BooklySection[]> => {
  const response = await fetch(PROXIED_EBOOKS_API_URL, { signal });

  if (!response.ok) {
    throw new Error(`The ebook API responded with ${ response.status }.`);
  }

  const payload = await response.json();

  return parseBooklyResponse(payload);
};

export const fetchDiscoverSections = async (signal?: AbortSignal): Promise<BooklySection[]> => {
  const response = await fetch(PROXIED_DISCOVER_API_URL, { signal });

  if (!response.ok) {
    throw new Error(`The discover API responded with ${ response.status }.`);
  }

  const payload = await response.json();

  return parseBooklyResponse(payload);
};

export const createBookSearchUrl = (query: string): string => {
  const searchUrl = new URL(BOOK_SEARCH_API_URL);
  searchUrl.searchParams.set("q", query);

  return `/api/proxy?url=${ encodeURIComponent(searchUrl.toString()) }`;
};

export const fetchBookSearchResults = async (
  query: string,
  signal?: AbortSignal
): Promise<DisplaySearchResult[]> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const response = await fetch(createBookSearchUrl(trimmedQuery), { signal });

  if (!response.ok) {
    throw new Error(`The book search API responded with ${ response.status }.`);
  }

  const payload = await response.json();

  return parseBookSearchResponse(payload)
    .map(toDisplaySearchResult)
    .filter((item): item is DisplaySearchResult => item !== null);
};
