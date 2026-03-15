import { createAsync, query } from "@solidjs/router";
import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { fetchRepos } from "~/lib/github";

// Define a server method for fetching repositories from
// GitHub, using the cache if available.
let cachedRepos = [];
let cachedUntil = 0;
const getRepos = query(async () => {
  "use server";

  // Case one, we have a valid cache
  if (Date.now() < cachedUntil) {
    return cachedRepos;
  }

  // Case two, we have a stale cache
  if (cachedUntil > 0) {
    fetchRepos().then(repos => {
      cachedRepos = repos;
      cachedUntil = Date.now() + 5 * 60000;
    });

    return cachedRepos;
  }

  // Case three, cold start
  const repos = await fetchRepos();
  cachedRepos = repos;
  cachedUntil = Date.now() + 5 * 60000;

  return repos;
});

// Format a date string as a short relative time (e.g. "3d", "2w").
function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 4) return `${w}w`;
  return `${Math.floor(d / 30)}mo`;
}

// A component for displaying a repository as a git-log style
// commit list.
function RepoCard({ url, name, lang, commits, count }) {
  return (
    <a
      href={url}
      class="bg-base2 ring-blue dark:bg-base02 flex h-full flex-col rounded-md p-4 transition-shadow hover:ring-2"
    >
      <div class="mb-3 flex flex-row leading-none">
        <span class="text-base00 dark:text-base1 mr-auto font-semibold">
          {name}
        </span>
        <span class="text-base1 dark:text-base01 ml-auto">{lang}</span>
      </div>
      <div class="flex flex-col gap-1.5 font-mono text-sm">
        <For each={commits}>
          {commit => (
            <div class="flex min-w-0 flex-row items-baseline gap-2">
              <span class="text-blue shrink-0">{commit.oid}</span>
              <span class="text-base00 dark:text-base0 min-w-0 truncate">
                {commit.message}
              </span>
              <span class="text-base1 dark:text-base01 ml-auto shrink-0 text-xs">
                {timeAgo(commit.date)}
              </span>
            </div>
          )}
        </For>
      </div>
      <p class="text-base1 dark:text-base01 mt-3 font-mono text-xs leading-none">
        +{count - commits.length} more
      </p>
    </a>
  );
}

// A component that renders an animated SVG of my signature
// and inherits the parent's text color.
function Signature(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="0.75"
      stroke-linecap="round"
      viewBox="-0.5 -0.5 63 21"
      preserveAspectRatio="xMaxYMin meet"
      {...props}
    >
      <path
        d="m 9.9900403,8.415182 c 10.6498997,-3.818 10.9541997,-10.273 1.5410997,-7.338 -6.1439997,1.917 -14.6847997,9.722 -9.7066997,10.098 4.5997,0.347 9.9388997,1.768 9.2276997,3.973 -0.9201,2.852 -4.5670997,5.135 -6.1799997,4.089 -1.9751,-1.281 1.366,-2.628 4.4739,-3.347 3.1311997,-0.723 18.2472997,-4.889 48.7674997,-0.167"
        stroke-dasharray="111"
        stroke-dashoffset="111"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="111"
          to="0"
          dur="1s"
          fill="freeze"
          begin="0s"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.45 0 0.55 1"
        />
      </path>

      <path
        d="m 51.46954,13.308182 -2.1161,4.6"
        stroke-dasharray="6"
        stroke-dashoffset="6"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="6"
          to="0"
          dur="0.1s"
          fill="freeze"
          begin="1.1s"
        />
      </path>

      <path
        d="m 53.81554,13.308182 -2.116,4.6"
        stroke-dasharray="6"
        stroke-dashoffset="6"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="6"
          to="0"
          dur="0.1s"
          fill="freeze"
          begin="1.2s"
        />
      </path>

      <path
        d="m 60.31854,16.065182 0.713,0.115"
        stroke-dasharray="1"
        stroke-dashoffset="1"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="1"
          to="0"
          dur="0.05s"
          fill="freeze"
          begin="1.5s"
        />
      </path>
    </svg>
  );
}

// The landing page. This contains some eye-candy, a short
// bio, and pulls recentry updated repositories.
export default function Home() {
  const repos = createAsync(getRepos);

  return (
    <>
      <Title>Home | shmish.dev</Title>

      <Meta name="description" content="Shmish's corner of the internet" />
      <Meta name="og:description" content="Shmish's corner of the internet" />
      <Meta name="og:title" content="Home | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/" />

      <section class="flex flex-col">
        <h1 class="text-base01 dark:text-base1 relative font-serif text-4xl whitespace-pre">
          Hello,
          <br />
          my name is{" "}
          <Signature class="absolute bottom-1 inline h-12 align-baseline" />
        </h1>

        <p class="text-base00 dark:text-base0 mt-5 text-justify font-sans">
          I'm a software engineer and maker of things bringing your embedded
          projects to life with the brilliant team over at{" "}
          <a href="https://prescoinc.com" class="link">
            PRESCO, Inc.
          </a>{" "}
        </p>

        <p class="text-base00 dark:text-base0 mt-5 text-justify font-sans">
          I also take on select freelance work in Rust development and edge
          machine learning systems. Building something ambitious? Reach out
          anytime at{" "}
          <a class="link" href="mailto:me@shmish.dev">
            me@shmish.dev
          </a>{" "}
          &mdash; Or explore some of my work on{" "}
          <a class="link" href="https://github.com/shmishtopher">
            GitHub
          </a>{" "}
          and{" "}
          <a class="link" href="https://www.youtube.com/@shmishtopher">
            YouTube.
          </a>{" "}
        </p>
      </section>

      <section class="mt-8 flex flex-col">
        <h1 class="text-base01 dark:text-base1 font-serif text-4xl">
          Latest Commits.
        </h1>

        <div class="mt-5 grid grid-cols-1 gap-6 font-sans md:grid-cols-2">
          <For each={repos()}>{repo => <RepoCard {...repo} />}</For>
        </div>
      </section>
    </>
  );
}

// Define a preload method on this route so that we start
// loading repositories from cache or remote as early as
// possible.
export const route = {
  preload: getRepos,
};
