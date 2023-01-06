import { readdir } from "fs/promises"


export async function getServerSideProps({ res }) {
  const slugs = [
    "",
    "labs",
    "notes",
    "homework",

    ...await readdir("./pages/labs").then(pages => pages
      .filter(page => page.endsWith(".mdx"))
      .map(page => page.slice(0, -4))
      .map(page => "labs/" + page)
    ),

    ...await readdir("./pages/notes").then(pages => pages
      .filter(page => page.endsWith(".mdx"))
      .map(page => page.slice(0, -4))
      .map(page => "labs/" + page)
    ),
  ]

  const url = slug => `
    <url>
      <loc>https://shmish.dev/${slug}</loc>
    </url>
  `

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${slugs.map(url).join("")}
    </urlset>
  `

  res.setHeader("Content-Type", "text/xml")
  res.setHeader("Cache-Control", "s-maxage=600")
  res.end(xml)

  return {
    props: {}
  }
}

export default function sitemap() {
  return null
}
