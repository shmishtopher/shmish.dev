import { Meta, Title } from "solid-start"
import { HttpHeader } from "solid-start/server"

export default function Baubles() {
  return (
    <>
      <Title>Baubles - shmish.dev</Title>
      <Meta name="description" content="Delightful Digital Trinkets!" />
      <Meta name="og:title" content="Baubles - shmish.dev" />
      <Meta name="og:description" content="Delightful Digital Trinkets!" />
      <Meta name="og:url" content="https://shmish.dev/baubles" />
      <HttpHeader
        name="Cache-Control"
        value="stale-while-revalidate, s-maxage=600"
      />

      <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        Baubles.
      </h1>
      <p className="mt-8 font-mona text-base00 dark:text-base0">
        Under construction.
        <br />
        Use your favorite RSS aggregator to subscribe to updates.
      </p>
    </>
  )
}
