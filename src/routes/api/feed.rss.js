import { Feed } from "feed";

export async function GET() {
  const headers = {
    "Content-Type": "text/xml",
    "Cache-Control": "s-maxage=300",
  };

  const feed = new Feed({
    title: "Shmish's Notes",
    description: "Notes on Technology, Computer Science, and Public Policy",
    id: "https://shmish.dev/notes",
    link: "https://shmish.dev/notes",
    language: "en",
    image: "https://shmish.dev/images/banner.png",
    favicon: "https://shmish.dev/images/favicon.svg",
    copyright: "2023 Chritopher K. Schmitt",
    updated: notes[0]?.date,
    author: {
      name: "Christopher K. Schmitt",
      email: "me@shmish.dev",
      link: "https://shmish.dev",
    },
  });

  return new Response(feed.rss2(), { headers });
}
