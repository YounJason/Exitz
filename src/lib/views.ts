export type ViewMap = Record<string, number>;

type KVNamespace = {
  get(key: string, type: "json"): Promise<any | null>;
  put(key: string, value: string): Promise<void>;
};

type RuntimeEnv = {
  VIEWS: KVNamespace;
};

const getViews = (runtime: RuntimeEnv) => runtime.VIEWS;

export async function getViewCount(
  runtime: RuntimeEnv,
  collection: "exit" | "help",
  slug: string,
): Promise<number> {
  const key = `${collection}:${slug}`;
  return (await getViews(runtime).get(key, "json")) ?? 0;
}

export async function incrementViewCount(
  runtime: RuntimeEnv,
  collection: "exit" | "help",
  slug: string,
): Promise<number> {
  const key = `${collection}:${slug}`;
  const current = await getViewCount(runtime, collection, slug);
  const next = current + 1;

  await getViews(runtime).put(key, JSON.stringify(next));

  return next;
}

export async function getViewCounts(
  runtime: RuntimeEnv,
  collection: "exit" | "help",
  slugs: string[],
): Promise<ViewMap> {
  const entries = await Promise.all(
    slugs.map(async (slug) => [
      slug,
      await getViewCount(runtime, collection, slug),
    ] as const),
  );

  return Object.fromEntries(entries);
}