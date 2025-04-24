import { Meta, Title } from "@solidjs/meta";

export default function Notes() {
  return (
    <>
      <Title>Notes | shmish.dev</Title>

      <Meta
        name="description"
        content="Notes on Technology, Computing, and Public Policy"
      />

      <Meta
        name="og:description"
        content="Notes on Technology, Computing, and Public Policy"
      />

      <Meta name="og:title" content="Notes | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/notes" />

      <h1 class="text-base01 dark:text-base1 font-serif text-4xl">Notes.</h1>

      <p class="text-base00 dark:text-base0 mt-5 text-justify font-sans">
        Sometimes I write about computing, technology, and public policy. These
        are selected entries from my journal. Use your favorite RSS reader to
        subscribe to updates. Any comments may be addressed to{" "}
        <a class="link" href="mailto:me@shmish.dev">
          me@shmish.dev.
        </a>
      </p>
    </>
  );
}
