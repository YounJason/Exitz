export const prerender = false;

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get("type") || "exit";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "9", 10);

  const collectionName = type === "help" ? "help" : "exit";
  const allPosts = await getCollection(collectionName);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  const items = paginatedPosts.map((post: any) => ({
    slug: post.slug || post.id,
    serviceName: post.data.serviceName || null,
    domain: post.data.domain || null,
    title: post.data.title || null,
    description: post.data.description || null,
    logo: post.data.logo || null,
  }));

  return new Response(
    JSON.stringify({
      items,
      hasMore: endIndex < allPosts.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};