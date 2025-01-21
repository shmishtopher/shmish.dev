import { SitemapStream, streamToPromise } from "sitemap";
import sql from "~/lib/database";

export async function GET() {
  const sitemapStream = new SitemapStream({ hostname: "https://shmish.dev/" });

  // Create all of the base routes
  const baseRoutes = [
    { url: "/", priority: 1.0 },
    { url: "/notes", priority: 0.9 },
    { url: "/baubles", priority: 0.8 },
    { url: "/guestbook", priority: 0.8 },
  ];

  for (const route of baseRoutes) {
    sitemapStream.write(route);
  }

  // Loop over all of the notes
  const notes = await sql`
    SELECT path
    FROM notes
    ORDER BY date DESC
  `;

  for (const { path } of notes) {
    sitemapStream.write({ url: `/notes/${path}`, priority: 0.7 });
  }

  // Loop over all of the baubles
  // TODO

  const sitemap = await streamToPromise(sitemapStream.end());

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
