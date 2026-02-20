import { Feed } from "feed";

export async function GET() {
  const headers = {
    "Content-Type": "text/xml",
    "Cache-Control": "s-maxage=300",
  };

  const feed = new Feed({
    title: "Shmish's Baubles",
    description: "A directory of finished projects and creative works",
    id: "https://shmish.dev/baubles",
    link: "https://shmish.dev/baubles",
    language: "en",
    image: "https://shmish.dev/images/banner.png",
    favicon: "https://shmish.dev/images/favicon.svg",
    copyright: "2023 Chritopher K. Schmitt",
    updated: baubles[0]?.date,
    author: {
      name: "Christopher K. Schmitt",
      email: "me@shmish.dev",
      link: "https://shmish.dev",
    },
  });

  return new Response(feed.rss2(), { headers });
}
