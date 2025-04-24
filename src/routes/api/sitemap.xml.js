import { SitemapStream, streamToPromise } from "sitemap";

export async function GET() {
  const sitemapStream = new SitemapStream({ hostname: "https://shmish.dev/" });

  // Create all of the base routes
  const baseRoutes = [
    { url: "/", priority: 1.0 },
    { url: "/notes", priority: 0.9 },
    { url: "/guestbook", priority: 0.8 },
  ];

  for (const route of baseRoutes) {
    sitemapStream.write(route);
  }

  const sitemap = await streamToPromise(sitemapStream.end());

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
