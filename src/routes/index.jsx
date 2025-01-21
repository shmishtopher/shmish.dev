import { createAsync } from "@solidjs/router";
import { ErrorBoundary, For, Suspense } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { Name, Glob } from "~/components/svg";
import { LoadingCards, RepoCard } from "~/components/card";
import sql from "~/lib/database";

async function getRepos() {
  "use server";

  // Define the URI for loading all of the recent repos
  const uri =
    "https://api.github.com/users/shmishtopher/repos?sort=created&type=owner";

  // Start by checking the API cache for a previously
  // cached result.
  const [cacheResult] = await sql`
    SELECT response
    FROM api_cache
    WHERE uri = ${uri}
    AND cached_at > NOW() - INTERVAL '6 hours'
    LIMIT 1
  `;

  // We have a cached result, return it
  if (cacheResult) {
    return cacheResult.response;
  }

  // The cache is empty or expired, fetch and populate it
  const headers = {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
  };
  const data = await fetch(uri, { headers })
    .then(res => res.json())
    .then(res => res.filter(repo => !repo.fork))
    .then(res => res.slice(0, 6));

  // Cache the fresh result
  await sql`
    INSERT INTO api_cache (uri, response, cached_at)
    VALUES (${uri}, ${data}, NOW())
    ON CONFLICT (uri)
    DO UPDATE SET
      response = EXCLUDED.response,
      cached_at = EXCLUDED.cached_at;
  `;

  // Send the fresh data to the client
  return data;
}

export default function Home() {
  const repos = createAsync(getRepos, { deferStream: true });

  return (
    <>
      <Title>Home | shmish.dev</Title>

      <Meta
        name="description"
        content="Shmish's little corner of the internet"
      />

      <Meta
        name="og:description"
        content="Shmish's little corner of the internet"
      />

      <Meta name="og:title" content="Home | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/" />

      <section class="flex flex-col-reverse md:flex-row">
        <div class="md:max-w-[60%]">
          <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
            Hello,
            <br />
            my name is <Name class="inline h-7 align-baseline" />
          </h1>

          <p class="mt-5 text-justify font-mona text-base00 dark:text-base0">
            I'm a software engineer and maker of things who's currently bringing
            your embedded projects to life with an incredible team at{" "}
            <a class="link text-blue" href="https://www.prescoinc.com">
              PRESCO, Inc.
            </a>
          </p>

          <p class="mt-5 text-justify font-mona text-base00 dark:text-base0">
            Looking to get in touch? Email me at{" "}
            <a class="link text-blue" href="mailto:me@shmish.dev">
              me@shmish.dev
            </a>{" "}
            and take a look at my{" "}
            <a
              class="link text-blue"
              href="https://raw.githubusercontent.com/shmishtopher/CV/master/cv.pdf"
            >
              CV.
            </a>{" "}
            I also have a{" "}
            <a class="link text-blue" href="https://github.com/shmishtopher">
              GitHub
            </a>{" "}
            profile and a{" "}
            <a
              class="link text-blue"
              href="https://www.youtube.com/@shmishtopher"
            >
              YouTube
            </a>{" "}
            channel you might be interested in.
          </p>
        </div>

        <Glob class="mx-auto min-w-[33%] md:ml-auto md:mr-0" />
      </section>

      <section class="mt-16 flex flex-col">
        <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
          Latest Work.
        </h1>

        <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ErrorBoundary fallback={LoadingCards({ count: 6 })}>
            <For each={repos()}>{repo => <RepoCard {...repo} />}</For>
          </ErrorBoundary>
        </div>
      </section>
    </>
  );
}
