export async function GET() {
  const headers = {
    "Content-Type": "text/xml",
    "Cache-Control": "s-maxage=300",
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://shmish.dev</loc>
    </url>
    <url>
      <loc>https://shmish.dev/baubles</loc>
    </url>
    <url>
      <loc>https://shmish.dev/guestbook</loc>
    </url>
    <url>
      <loc>https://shmish.dev/homework</loc>
    </url>
    <url>
      <loc>https://shmish.dev/notes</loc>
    </url>
  </urlset>`

  return new Response(xml, { headers })
}
