import { ErrorBoundary, Suspense } from "solid-js";
import { A, Router } from "@solidjs/router";
import { MetaProvider, Title, Meta } from "@solidjs/meta";
import { FileRoutes } from "@solidjs/start/router";
import "~/app.css";
import NotFound from "./routes/[...404]";

function Shell(props) {
  // Let's define some styles for our navigation compnents
  // to use.  Different classes are applied based on the
  // currently active page
  const linkStyles = {
    activeClass:
      "rounded-md p-2 font-hubot hover:bg-base2 dark:hover:bg-base02 md:px-3 underline underline-offset-4 decoration-1 text-base01 dark:text-base1",
    inactiveClass:
      "rounded-md p-2 font-hubot hover:bg-base2 dark:hover:bg-base02 md:px-3 no-underline text-base00 dark:text-base0",
  };

  return (
    <MetaProvider>
      <Title>shmish.dev</Title>

      <Meta
        name="description"
        content="Shmish's little corner of the internet"
      />

      <Meta name="og:title" content="shmish.dev" />
      <Meta name="og:type" content="website" />
      <Meta name="og:image" content="/images/banner.png" />
      <Meta name="og:url" content="https://shmish.dev/" />
      <Meta name="og:site_name" content="shmish.dev" />
      <Meta
        name="og:description"
        content="Shmish's little corner of the internet"
      />

      <main class="mx-auto flex max-w-2xl flex-col px-7 py-2 md:px-0">
        <nav class="relative -left-2 mb-8 mt-6 flex flex-row items-center md:-left-3">
          <A {...linkStyles} href="/" end={true}>
            Home
          </A>
          <A {...linkStyles} href="/notes">
            Notes
          </A>
          <A {...linkStyles} href="/baubles">
            Baubles
          </A>
          <A {...linkStyles} href="/guestbook">
            Guestbook
          </A>
        </nav>

        <Suspense>
          <ErrorBoundary fallback={NotFound()}>{props.children}</ErrorBoundary>
        </Suspense>

        <footer class="my-10 flex w-full flex-col border-t-2 border-solid border-base2 py-8 font-hubot text-base00 md:flex-row md:justify-between dark:border-base02 dark:text-base0">
          <ul>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <A href="/">Home</A>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <A href="/notes">Notes</A>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <A href="/baubles">Baubles</A>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <A href="/guestbook">Guestbook</A>
            </li>
          </ul>

          <ul>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <a rel="external" href="https://github.com/shmishtopher">
                GitHub
              </a>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <a rel="external" href="https://www.youtube.com/@shmishtopher">
                YouTube
              </a>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <a
                rel="external"
                href="https://www.linkedin.com/in/christopher-schmitt-3939431b5"
              >
                LinkedIn
              </a>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <a rel="external" href="mailto:me@shmish.dev">
                Contact
              </a>
            </li>
          </ul>

          <ul>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <a rel="external" href="/api/feed.rss">
                RSS Feed
              </a>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <a rel="external" href="/api/sitemap.xml">
                Sitemap
              </a>
            </li>
            <li class="mb-4 hover:text-base01 hover:dark:text-base1">
              <a
                rel="external"
                href="https://github.com/shmishtopher/shmish.dev"
              >
                Source
              </a>
            </li>
          </ul>
        </footer>
      </main>
    </MetaProvider>
  );
}

// Define the main application router, injecting the app
// shell that includes the nav bar and footer
export default function App() {
  return (
    <Router root={Shell}>
      <FileRoutes />
    </Router>
  );
}
