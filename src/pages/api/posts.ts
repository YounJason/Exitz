export const prerender = false;

import { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getViewCounts } from "../../lib/views";
import {
  normalizeSort,
  sortPosts,
} from "../../lib/sort";

export const GET: APIRoute = async ({ url, locals }) => {
  const type = url.searchParams.get("type") || "exit";
  const page = parseInt(
    url.searchParams.get("page") || "1",
    10,
  );
  const limit = parseInt(
    url.searchParams.get("limit") || "9",
    10,
  );

  const sort = normalizeSort(
    url.searchParams.get("sort"),
  );

  const collectionName =
    type === "help" ? "help" : "exit";

  const allPosts =
    await getCollection(collectionName);

  const slugs = allPosts.map(
    (post: any) => post.slug || post.id,
  );

  const viewMap = await getViewCounts(
    locals.runtime.env as any,
    collectionName,
    slugs,
  );

  const sortedPosts = sortPosts(
    allPosts,
    viewMap,
    sort,
  );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPosts = sortedPosts.slice(
    startIndex,
    endIndex,
  );

  const items = paginatedPosts.map((post: any) => {
    const slug = post.slug || post.id;

    return {
      slug,
      serviceName: post.data.serviceName || null,
      domain: post.data.domain || null,
      title: post.data.title || null,
      description: post.data.description || null,
      logo: post.data.logo || null,
      pubDate: post.data.pubDate
        ? post.data.pubDate.toISOString()
        : null,
      views: viewMap[slug] ?? 0,
    };
  });

  return Response.json({
    items,
    hasMore: endIndex < sortedPosts.length,
    sort,
  });
};