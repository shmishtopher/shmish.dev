import { A } from "@solidjs/router";

// The 404 page for the site.  This is the page that will
// be rendered when a user tries to navigate to a page that
// does not exist.
export default function NotFound() {
  return (
    <>
      <h1 class="text-base01 dark:text-base1 font-serif text-4xl">
        418 - I&apos;m a teapot.
      </h1>
      <div class="text-base00 dark:text-base0 mt-5 text-justify font-sans">
        <p>
          Just kidding, you&apos;ve actaully stumbled into my 404 page. It looks
          like the page you&apos;re trying to get to no longer exists. Perhaps
          it never did. Let&apos;s get you back{" "}
          <A href="/" class="link">
            home.
          </A>
        </p>

        <p class="mt-4">
          Alternatively, you can take this opportunity read{" "}
          <a href="https://www.rfc-editor.org/rfc/rfc2324" class="link">
            RFC 2324,
          </a>{" "}
          the document that defines the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol"
            class="link"
          >
            Hyper Text Coffee Pot Control Protocol.
          </a>{" "}
          If you think that this page should exist, don&apos;t hesitate to reach
          out to me at{" "}
          <a href="mailto:me@shmish.dev" class="link">
            me@shmish.dev
          </a>
        </p>

        <figure class="mt-4">
          <blockquote class="border-l-4 px-5 font-semibold">
            Any attempt to brew coffee with a teapot should result in the error
            code &quot;418 I&apos;m a teapot&quot;. The resulting entity body
            MAY be short and stout.
          </blockquote>
          <figcaption class="text-base1 dark:text-base01 text-center">
            RFC 2324 § 2.3.2
          </figcaption>
        </figure>
      </div>
    </>
  );
}
