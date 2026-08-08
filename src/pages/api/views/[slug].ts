export const prerender = false;

import type { APIRoute } from "astro";
import {
  getViewCount,
  incrementViewCount,
} from "../../../lib/views";

function resolveCollection(
  type: string | null,
): "exit" | "help" {
  return type === "help" ? "help" : "exit";
}

export const GET: APIRoute = async ({
  params,
  url,
  locals,
}) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(
      JSON.stringify({ error: "slug is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const collection = resolveCollection(
    url.searchParams.get("type"),
  );

  const env = locals.runtime.env as any;

  const views = await getViewCount(
    env,
    collection,
    slug,
  );

  return Response.json({ slug, views });
};

export const POST: APIRoute = async ({
  params,
  url,
  locals,
}) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(
      JSON.stringify({ error: "slug is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const collection = resolveCollection(
    url.searchParams.get("type"),
  );

  const env = locals.runtime.env as any;

  const views = await incrementViewCount(
    env,
    collection,
    slug,
  );

  return Response.json({ slug, views });
};