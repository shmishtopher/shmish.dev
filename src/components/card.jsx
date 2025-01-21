/**
 * A card that displays a github repository.  Includes the
 * name, description, language, and provides a link.
 */
export function RepoCard({ name, description, language, html_url }) {
  return (
    <a href={html_url}>
      <div class="rounded-md bg-base2 p-4 ring-blue transition-shadow hover:ring-2 dark:bg-base02">
        <h1 class="flex flex-row items-center font-hubot text-xl font-semibold text-base01 dark:text-base1">
          {name}
          <span class="lang align-middle" data-language={language}>
            {language}
          </span>
        </h1>

        <p class="font-mona text-base00 dark:text-base0">{description}</p>
      </div>
    </a>
  );
}

/**
 * A card that displays an empty placeholder
 */
export function LoadingCards({ count = 1 }) {
  const card = () => (
    <a>
      <div class="animate-pulse rounded-md bg-base2 p-4 dark:bg-base02">
        <h1 class="h-5 w-1/3 rounded-md bg-base01 dark:bg-base1" />

        <p class="mt-2 flex h-4 w-full flex-row">
          <span class="mr-2 h-full w-1/2 rounded-md bg-base00 dark:bg-base0" />
          <span class="mr-2 h-full w-1/4 rounded-md bg-base00 dark:bg-base0" />
        </p>
        <p class="mt-2 flex h-4 w-full flex-row">
          <span class="mr-2 h-full w-1/4 rounded-md bg-base00 dark:bg-base0" />
          <span class="mr-2 h-full w-1/2 rounded-md bg-base00 dark:bg-base0" />
        </p>
      </div>
    </a>
  );

  return new Array(count).fill(0).map(card);
}
