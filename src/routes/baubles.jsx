import { Title, Meta } from "@solidjs/meta";

export default function Baubles() {
  return (
    <>
      <Title>Baubles | shmish.dev</Title>

      <Meta name="description" content="Delightful digital trinkets" />
      <Meta name="og:description" content="Delightful digital trinkets" />
      <Meta name="og:title" content="Baubles | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/baubles" />

      <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        Baubles.
      </h1>
      <p className="mt-5 font-mona text-base00 dark:text-base0">
        Under construction.
        <br />
        Use your favorite RSS aggregator to subscribe to updates.
      </p>
    </>
  );
}
