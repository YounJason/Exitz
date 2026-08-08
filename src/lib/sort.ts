import type { ViewMap } from "./views";

export type SortOption = "latest" | "oldest" | "views" | "alpha";

export const SORT_LABELS: Record<SortOption, string> = {
  latest: "최신순",
  oldest: "날짜순",
  views: "조회수순",
  alpha: "가나다순",
};

export const SORT_OPTIONS: SortOption[] = ["latest", "oldest","views",  "alpha"];

export function normalizeSort(value: string | null | undefined): SortOption {
  if (value === "views" || value === "oldest" || value === "alpha" || value === "latest") {
    return value;
  }
  return "latest";
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
  const getViews = (post: T) => viewMap[getSlug(post)] || 0;
  const getTime = (post: T) => new Date(post.data.pubDate).getTime();
  const copy = [...posts];

  switch (sort) {
    case "views":
      return copy.sort((a, b) => {
        const diff = getViews(b) - getViews(a);
        return diff !== 0 ? diff : getTime(b) - getTime(a);
      });
    case "oldest":
      return copy.sort((a, b) => getTime(a) - getTime(b));
    case "alpha":
      return copy.sort((a, b) => {
        const an = (a.data.serviceName || a.data.title || "").toString();
        const bn = (b.data.serviceName || b.data.title || "").toString();
        return an.localeCompare(bn, "ko");
      });
    case "latest":
    default:
      return copy.sort((a, b) => getTime(b) - getTime(a));
  }
}
