// @refresh reload
import { Suspense } from "solid-js"
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start"

import "~/tailwind.css"

/**
 * The root layout for the site.  This is the top level
 * component that wraps all of the pages on the site with a
 * navigation bar and a footer.
 */
export default function Root() {
  // Let's define some styles for our navigation compnents
  // to use.  Different classes are applied based on the
  // currently active page
  const linkStyles = {
    activeClass:
      "rounded-md p-2 font-hubot hover:bg-base2 dark:hover:bg-base02 md:px-3 font-semibold text-base01 dark:text-base1",
    inactiveClass:
      "rounded-md p-2 font-hubot hover:bg-base2 dark:hover:bg-base02 md:px-3 font-normal text-base00 dark:text-base0",
  }

  return (
    <Html lang="en">
      <Head>
        <Title>shmish.dev</Title>

        <Link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <Link rel="icon" type="image/png" href="/images/favicon.png" />
        <Link
          rel="alternate"
          type="application/rss+xml"
          title="Subscribe to updates"
          href="/api/feed.rss"
        />

        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta
          name="description"
          content="Welcome to my little corner of the internet"
        />
        <Meta name="robots" content="follow, index" />
        <Meta name="author" content="Shmish - me@shmish.dev" />

        <Meta name="og:title" content="shmish.dev" />
        <Meta name="og:type" content="website" />
        <Meta name="og:image" content="images/banner.png" />
        <Meta
          name="og:description"
          content="Welcome to my little corner of the internet"
        />
        <Meta name="og:url" content="https://shmish.dev" />
        <Meta name="og:site_name" content="shmish.dev" />
      </Head>

      <Body className="bg-base3 dark:bg-base03">
        <main className="mx-auto flex max-w-2xl flex-col px-7 py-2 md:px-0">
          <nav className="relative -left-2 mb-8 mt-6 flex flex-row items-center md:-left-3">
            <A {...linkStyles} href="/" end={true}>
              Home
            </A>
            <A {...linkStyles} href="/notes">
              Notes
            </A>
            <A {...linkStyles} href="/Baubles">
              Baubles
            </A>
            <A {...linkStyles} href="/guestbook">
              Guestbook
            </A>
          </nav>

          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>

          <footer className="my-10 flex w-full flex-col border-t-2 border-solid border-base2 py-8 font-hubot text-base00 dark:border-base02 dark:text-base0 md:flex-row md:justify-between">
            <ul>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <A href="/">Home</A>
              </li>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <A href="/guestbook">Guestbook</A>
              </li>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <A href="/baubles">Baubles</A>
              </li>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <A href="/homework">Homework Help</A>
              </li>
            </ul>

            <ul>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <a href="https://github.com/shmishtopher">GitHub</a>
              </li>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <a href="/404">YouTube</a>
              </li>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <a href="mailto:me@shmish.dev">Contact</a>
              </li>
            </ul>

            <ul>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <a href="/api/feed.rss">RSS Feed</a>
              </li>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <a href="/api/sitemap.xml">Sitemap</a>
              </li>
              <li className="mb-4 hover:text-base01 hover:dark:text-base1">
                <a href="https://github.com/shmishtopher/shmish.dev">Source</a>
              </li>
            </ul>
          </footer>
        </main>
        <Scripts />
      </Body>
    </Html>
  )
}
