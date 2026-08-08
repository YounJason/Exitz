import { getStore } from "@netlify/blobs";

export type ViewMap = Record<string, number>;

const STORE_NAME = "post-views";

function viewStore() {
  return getStore(STORE_NAME);
}

async function readViewMap(collection: string): Promise<ViewMap> {
  const store = viewStore();
  try {
    const data = await store.get(collection, { type: "json" });
    return (data as ViewMap) || {};
  } catch {
    return {};
  }
}

export async function getViewCounts(collection: string): Promise<ViewMap> {
  return readViewMap(collection);
}

export async function getViewCount(
  collection: string,
  slug: string,
): Promise<number> {
  const map = await readViewMap(collection);
  return map[slug] || 0;
}

export async function incrementViewCount(
  collection: string,
  slug: string,
): Promise<number> {
  const store = viewStore();
  const map = await readViewMap(collection);
  const next = (map[slug] || 0) + 1;
  map[slug] = next;
  await store.setJSON(collection, map);
  return next;
}
