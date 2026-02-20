import { Meta, Title } from "@solidjs/meta";

export default function Baubles() {
  return (
    <>
      <Title>Baubles | shmish.dev</Title>

      <Meta
        name="description"
        content="A directory of finished projects and creative works"
      />

      <Meta
        name="og:description"
        content="A directory of finished projects and creative works"
      />

      <Meta name="og:title" content="Baubles | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/baubles" />

      <h1 class="text-base01 dark:text-base1 font-serif text-4xl">Baubles.</h1>

      <p class="text-base00 dark:text-base0 mt-5 text-justify font-sans">
        A collection of my finished projects and creative works. Questions or
        comments may be addressed to{" "}
        <a class="link" href="mailto:me@shmish.dev">
          me@shmish.dev.
        </a>
      </p>
    </>
  );
}
