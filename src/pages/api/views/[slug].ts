export const prerender = false;

import type { APIRoute } from "astro";
import { getViewCount, incrementViewCount } from "../../../lib/views";

function resolveCollection(type: string | null): "exit" | "help" {
  return type === "help" ? "help" : "exit";
}

export const GET: APIRoute = async ({ params, url }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "slug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const collection = resolveCollection(url.searchParams.get("type"));
  const views = await getViewCount(collection, slug);

  return new Response(JSON.stringify({ slug, views }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ params, url }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "slug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const collection = resolveCollection(url.searchParams.get("type"));
  const views = await incrementViewCount(collection, slug);

  return new Response(JSON.stringify({ slug, views }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
