import { Title, Meta } from "solid-start"
import { Name, Glob } from "~/components/svg"
import { HttpHeader, createServerData$ } from "solid-start/server"
import Redis from "ioredis"
import RepoCard from "~/components/repo-card"
import { For } from "solid-js"

// Configure our redis client
const redis = new Redis(import.meta.env.VITE_GUESTBOOK_REDIS)

/**
 * Returns a list of repos, checking to see if we have a
 * cached response before hitting the limited GitHub API.
 */
async function getRepos() {
  const data = await redis.get("recentRepos")

  // If data exists in the cache, return it
  if (data) {
    return JSON.parse(data)
  }

  // Otherwise, fetch from the github API and store the
  // response in the redis cache for 5 min.
  const repos = await fetch(
    "https://api.github.com/users/shmishtopher/repos?sort=created&type=owner"
  )
    .then(res => res.json())
    .then(res => res.slice(0, 6))

  await redis.setex("recentRepos", 60 * 5, JSON.stringify(repos))

  return repos
}

export default function Home() {
  const repos = createServerData$(getRepos)

  return (
    <>
      <Title>shmish.dev</Title>
      <Meta
        name="description"
        content="Welcome to my little corner of the internet!"
      />
      <Meta name="og:title" content="shmish.dev" />
      <Meta
        name="og:description"
        content="Welcome to my little corner of the internet!"
      />
      <Meta name="og:url" content="https://shmish.dev" />
      <HttpHeader
        name="Cache-Control"
        value="stale-while-revalidate, s-maxage=300"
      />

      <section class="flex flex-col-reverse md:flex-row">
        <div class="md:max-w-[60%]">
          <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
            Hello,
            <br />
            my name is <Name class="inline h-7 align-baseline" />
          </h1>

          <p class="mt-5 font-mona text-base00 dark:text-base0">
            I'm a software engineer and maker of things who's currently building
            ML models to accelerate drug discovery with{" "}
            <a
              class="link text-blue"
              href="https://www.bioxceltherapeutics.com/"
            >
              BioXcel Therapeutics.
            </a>
          </p>

          <p class="mt-5 font-mona text-base00 dark:text-base0">
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
            </a>
          </p>
        </div>

        <Glob class="mx-auto min-w-[33%] md:ml-auto md:mr-0" />
      </section>

      <section className="mt-16 flex flex-col">
        <h1 className="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
          Latest Work.
        </h1>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <For each={repos()}>{repo => <RepoCard {...repo} />}</For>
        </div>
      </section>
    </>
  )
}
