import { For, Suspense } from "solid-js"
import { HttpHeader, createServerData$ } from "solid-start/server"
import Redis from "ioredis"
import RepoCard from "~/components/repo-card"
import LoadingCard from "~/components/loading-card"
import { Meta, Title } from "solid-start"

// Configure our redis client
const redis = new Redis(import.meta.env.VITE_GUESTBOOK_REDIS)

/**
 * Returns a list of repos, checking to see if we have a
 * cached response before hitting the limited GitHub API.
 */
async function getRepos() {
  const data = await redis.get("homeworkRepos")

  // If data exists in the cache, return it
  if (data) {
    return JSON.parse(data)
  }

  // Set auth headers
  const headers = {
    "Authorization": `Bearer ${import.meta.env.VITE_GH_TOKEN}`
  }

  // Otherwise, fetch from the github API and store the
  // response in the redis cache for 5 min.
  const responses = [
    "https://api.github.com/repos/shmishtopher/CS-253",
    "https://api.github.com/repos/shmishtopher/CS-355",
    "https://api.github.com/repos/shmishtopher/CS-354",
    "https://api.github.com/repos/shmishtopher/CS-254",
    "https://api.github.com/repos/shmishtopher/CS-153",
    "https://api.github.com/repos/shmishtopher/CS-385",
    "https://api.github.com/repos/shmishtopher/CS-483",
    "https://api.github.com/repos/shmishtopher/CS-492",
    "https://api.github.com/repos/shmishtopher/CS-463",
    "https://api.github.com/repos/shmishtopher/Semantic-Web",
  ]
    .map(url => fetch(url, { headers }))
    .map(p => p.then(res => res.json()))

  const repos = await Promise.all(responses)

  await redis.setex("homeworkRepos", 60 * 60 * 24, JSON.stringify(repos))

  return repos
}

export default function Homework() {
  const repos = createServerData$(getRepos)

  return (
    <>
      <Title>shmish.dev</Title>
      <Meta
        name="description"
        content="Notes and Assignments for the CCSU CS Program"
      />
      <Meta name="og:title" content="Homework Help - shmish.dev" />
      <Meta
        name="og:description"
        content="Notes and Assignments for the CCSU CS Program"
      />
      <Meta name="og:url" content="https://shmish.dev/homework" />
      <HttpHeader
        name="Cache-Control"
        value="stale-while-revalidate, s-maxage=86400"
      />

      <h1 className="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        Homework Help.
      </h1>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense fallback={<LoadingCard />}>
          <For each={repos()}>{repo => <RepoCard {...repo} />}</For>
        </Suspense>
      </div>
    </>
  )
}
