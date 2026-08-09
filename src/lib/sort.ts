import type { ViewMap } from "./views";

export type SortOption = "latest" | "oldest" | "views" | "alpha";

export const SORT_LABELS: Record<SortOption, string> = {
  views: "조회수순",
  latest: "최신순",
  oldest: "날짜순",
  alpha: "가나다순",
};

export const SORT_OPTIONS: SortOption[] = [
  "views",
  "latest",
  "oldest",
  "alpha",
];

export function normalizeSort(
  value: string | null | undefined,
): SortOption {
  if (
    value === "views" ||
    value === "latest" ||
    value === "oldest" ||
    value === "alpha"
  ) {
    return value;
  }

  return "views";
}

type SortablePost = {
  slug?: string;
  id: string;
  data: {
    pubDate: Date;
    serviceName?: string;
    title: string;
  };
};

export function sortPosts<T extends SortablePost>(
  posts: T[],
  viewMap: ViewMap,
  sort: SortOption,
): T[] {
  const getSlug = (post: T) => post.slug ?? post.id;
  const getViews = (post: T) => viewMap[getSlug(post)] ?? 0;
  const getTime = (post: T) =>
    new Date(post.data.pubDate).getTime();

  const copy = [...posts];

  switch (sort) {
    case "views":
      return copy.sort((a, b) => {
        const diff = getViews(b) - getViews(a);
        return diff !== 0
          ? diff
          : getTime(b) - getTime(a);
      });

    case "oldest":
      return copy.sort(
        (a, b) => getTime(a) - getTime(b),
      );

    case "alpha":
      return copy.sort((a, b) => {
        const aName =
          a.data.serviceName || a.data.title || "";
        const bName =
          b.data.serviceName || b.data.title || "";

        return aName.localeCompare(bName, "ko");
      });

    case "latest":
    default:
      return copy.sort(
        (a, b) => getTime(b) - getTime(a),
      );
  }
}