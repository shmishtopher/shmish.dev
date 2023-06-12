import { Meta, Title } from "solid-start"
import { HttpHeader } from "solid-start/server"

export default function Notes() {
  return (
    <>
      <Title>Notes - shmish.dev</Title>
      <Meta name="og:title" content="Notes - shmish.dev" />
      <Meta
        name="description"
        content="Notes on Technology, Computer Science, and Public Policy"
      />
      <Meta
        name="og:description"
        content="Notes on Technology, Computer Science, and Public Policy"
      />
      <Meta name="og:url" content="https://shmish.dev/notes" />
      <HttpHeader
        name="Cache-Control"
        value="stale-while-revalidate, s-maxage=300"
      />

      <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        Notes.
      </h1>
      <p className="mt-8 font-mona text-base00 dark:text-base0">
        Under construction.
        <br />
        Use your favorite RSS aggregator to subscribe to updates.
      </p>
    </>
  )
}
