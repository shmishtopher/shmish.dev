import { readdir } from "fs/promises"
import RSS from "rss"


export async function getServerSideProps({ res }) {
  const feed = new RSS({
    title: "shmish.dev",
    description: "Notes and projects from shmish.dev",
    site_url: "https://shmish.dev",
    feed_url: "https://shmish.dev/feed.xml",
    image_url: "https://shmish.dev/images/thumb.png",
    docs: "https://shmish.dev",
    managingEditor: "Christopher K. \"Shmish\" Schmitt",
    webMaster: "Christopher K. \"Shmish\" Schmitt",
    copyright: "(c) 2023 - Christopher K. \"Shmish\" Schmitt",
    language: "en",
    categories: ["technology", "politics"],
  })

  for (const lab in await readdir("./pages/labs")) {
    if (lab.endsWith(".mdx")) {
      const page = lab.slice(0, -4)
      const url = "https://shmish.dev/labs/" + page
      const { meta } = await import("./labs/" + page)

      feed.item({ url, ...meta })
    }
  }

  for (const lab in await readdir("./pages/notes")) {
    if (lab.endsWith(".mdx")) {
      const page = lab.slice(0, -4)
      const url = "https://shmish.dev/notes/" + page
      const { meta } = await import("./notes/" + page)

      feed.item({ url, ...meta })
    }
  }

  res.setHeader("Content-Type", "text/xml")
  res.setHeader("Cache-Control", "s-maxage=600")
  res.end(feed.xml({ indent: true }))
  
  return {
    props: {}
  }
}

export default function feed() {
  return null
}
