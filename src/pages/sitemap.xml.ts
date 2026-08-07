import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL: string = 'https://exitz.me';

interface Post {
  slug: string;
  data: {
    pubDate?: Date | string;
    [key: string]: any;
  };
}

function formatUrl(loc: string, lastmod?: string, changefreq = 'monthly', priority = '0.77'): string {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>\n    ` : ''}<changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const exitPosts = (await getCollection('exit')) as Post[];
  const helpPosts = (await getCollection('help')) as Post[];
  const lastmod: string = new Date().toISOString().slice(0, 10);

  const urls = [
    formatUrl('/', lastmod, 'daily', '1.00'),
    formatUrl('/exit', lastmod, 'weekly', '0.80'),
    formatUrl('/help', lastmod, 'weekly', '0.80'),
    ...exitPosts.map((post: Post) =>
      formatUrl(`/exit/${post.slug}`, post.data.pubDate instanceof Date ? post.data.pubDate.toISOString().slice(0, 10) : (post.data.pubDate as string | undefined) ?? lastmod, 'monthly', '0.77'),
    ),
    ...helpPosts.map((post: Post) =>
      formatUrl(`/help/${post.slug}`, post.data.pubDate instanceof Date ? post.data.pubDate.toISOString().slice(0, 10) : (post.data.pubDate as string | undefined) ?? lastmod, 'monthly', '0.77'),
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
