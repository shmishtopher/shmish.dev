import { ErrorBoundary, Suspense } from "solid-js";
import { A, Router } from "@solidjs/router";
import { MetaProvider, Title, Meta } from "@solidjs/meta";
import { FileRoutes } from "@solidjs/start/router";
import NotFound from "./routes/[...404]";
import "~/app.css";

// The main application shell. These elements wrap all of
// the pages and contains basic navigation.
function Shell(props) {
  // Let's define some styles for our navigation compnents
  // to use.  Different classes are applied based on the
  // currently active page
  const linkStyles = {
    class: "font-sans decoration-1 underline-offset-4 hover:underline",
    activeClass: "underline text-base01 dark:text-base1",
    inactiveClass: "no-underline text-base00 dark:text-base0",
  };

  return (
    <MetaProvider>
      <Title>shmish.dev</Title>

      <Meta name="description" content="Shmish's corner of the internet" />
      <Meta name="og:title" content="shmish.dev" />
      <Meta name="og:type" content="website" />
      <Meta name="og:image" content="/images/banner.png" />
      <Meta name="og:url" content="https://shmish.dev/" />
      <Meta name="og:site_name" content="shmish.dev" />
      <Meta name="og:description" content="Shmish's corner of the internet" />

      <main class="mx-auto flex max-w-2xl flex-col px-7 py-2 md:px-0">
        <nav class="mt-6 mb-8 flex flex-row items-center">
          <A {...linkStyles} href="/" end={true}>
            Home
          </A>
          <span class="text-base1 dark:text-base01 mx-4 select-none">/</span>
          <A {...linkStyles} href="/notes">
            Notes
          </A>
          <span class="text-base1 dark:text-base01 mx-4 select-none">/</span>
          <A {...linkStyles} href="/guestbook">
            Guestbook
          </A>
        </nav>

        <Suspense>
          <ErrorBoundary fallback={NotFound()}>{props.children}</ErrorBoundary>
        </Suspense>

        <footer class="border-base2 text-base00 dark:border-base02 dark:text-base0 my-10 flex w-full flex-col border-t-2 border-solid py-8 font-sans md:flex-row md:justify-between">
          <ul>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <A href="/">Home</A>
            </li>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <A href="/notes">Notes</A>
            </li>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <A href="/guestbook">Guestbook</A>
            </li>
          </ul>

          <ul>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <a rel="external" href="https://github.com/shmishtopher">
                GitHub
              </a>
            </li>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <a rel="external" href="https://www.youtube.com/@shmishtopher">
                YouTube
              </a>
            </li>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <a
                rel="external"
                href="https://www.linkedin.com/in/christopher-schmitt-3939431b5"
              >
                LinkedIn
              </a>
            </li>
          </ul>

          <ul>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <a rel="external" href="/api/feed.rss">
                RSS Feed
              </a>
            </li>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
              <a rel="external" href="/api/sitemap.xml">
                Sitemap
              </a>
            </li>
            <li class="hover:text-base01 hover:dark:text-base1 mb-4">
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
