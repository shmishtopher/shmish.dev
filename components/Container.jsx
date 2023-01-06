import Head from "next/head"
import { useRouter } from "next/router"
import Header from "./Header"
import Footer from "./Footer"

export default function Container({ children, ...metaProps }) {
  const router = useRouter()

  const meta = {
    title: "shmish.dev",
    description: "Developer and maker of things.",
    image: "https://shmish.dev/images/banner.png",
    type: "website",
    ...metaProps,
  }

  return (
    <main className="flex flex-col max-w-2xl mx-auto py-2 px-7 md:px-0">
      <Head>
        <title>{meta.title}</title>

        <link rel="canonical" href={"https://shmish.dev" + router.asPath} />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <link rel="icon" type="image/svg+xml" href="svg/favicon.svg" />
        <link rel="icon" type="image/png" href="images/favicon.png" />

        <meta name="description" content={meta.description} />
        <meta name="robots" content="follow, index" />
        <meta name="author" content="Shmish - me@shmish.dev" />

        <meta property="og:title" content={meta.title} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={"https://shmish.dev" + router.asPath} />
        <meta property="og:site_name" content="shmish.dev" />
      </Head>

      <Header />
      {children}
      <Footer />
    </main>
  )
}
