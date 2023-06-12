/**
 * A card that displays an empty placeholder
 */
export default function RepoCard() {
  return (
    <a>
      <div class="animate-pulse rounded-md bg-base2 p-4 dark:bg-base02">
        <h1 class="h-5 w-1/3 rounded-md bg-base01 dark:bg-base1" />

        <p class="mt-2 flex h-4 w-full flex-row ">
          <span class="mr-2 h-full w-1/2 rounded-md bg-base00 dark:bg-base0" />
          <span class="mr-2 h-full w-1/4 rounded-md bg-base00 dark:bg-base0" />
        </p>
        <p class="mt-2 flex h-4 w-full flex-row ">
          <span class="mr-2 h-full w-1/4 rounded-md bg-base00 dark:bg-base0" />
          <span class="mr-2 h-full w-1/2 rounded-md bg-base00 dark:bg-base0" />
        </p>
      </div>
    </a>
  )
}
