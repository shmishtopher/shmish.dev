import { Meta, Title } from "@solidjs/meta";
import { A, createAsync, useSearchParams } from "@solidjs/router";
import { For, Suspense } from "solid-js";
import sql from "~/lib/database";

async function getNotes(page = 1) {
  "use server";

  if (page < 1) {
    throw new Error("Page must be greader than zero");
  }

  // Run queries to get notes
  const notesQuery = sql`
    SELECT path, title, dek, tag, read_time, date
    FROM notes    
    ORDER BY date DESC
    LIMIT 5 OFFSET ${(page - 1) * 5}
  `;

  const countQuery = sql`
    SELECT COUNT(*) AS count
    FROM notes
  `;

  const [notes, [{ count }]] = await Promise.all([notesQuery, countQuery]);

  // Compute the metadata
  const start = count > 0 ? (page - 1) * 5 + 1 : 0;
  const end = Math.max(0, start + notes.length - 1);

  return { notes, count, start, end };
}

export default function Notes() {
  const [params, setParams] = useSearchParams();
  const notes = createAsync(() => getNotes(params.page ?? 1), {
    deferStream: true,
  });

  return (
    <>
      <Title>Notes | shmish.dev</Title>

      <Meta
        name="description"
        content="Notes on Technology, Computer Science, and Public Policy"
      />

      <Meta
        name="og:description"
        content="Notes on Technology, Computer Science, and Public Policy"
      />

      <Meta name="og:title" content="Notes | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/notes" />

      <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        Notes.
      </h1>

      <p class="mt-5 text-justify font-mona text-base00 dark:text-base0">
        Sometimes I write about computer science, technology, and public policy.
        These are selected entries from my journal. Use your favorite RSS reader
        to subscribe to updates. Any comments may be addressed to{" "}
        <a class="link text-blue" href="mailto:me@shmish.dev">
          me@shmish.dev
        </a>
        .
      </p>

      <For each={notes()?.notes}>
        {note => (
          <article class="mt-14 hover:opacity-70">
            <A href={note.path}>
              <h3 class="font-hubot font-light text-blue">{note.tag}</h3>
              <h2 class="mt-3 text-justify font-hubot text-2xl font-semibold text-base01 dark:text-base1">
                {note.title}
              </h2>
              <p class="mt-3 text-justify font-mona text-base00 dark:text-base0">
                {note.dek}
              </p>
              <p class="mt-3 font-hubot text-base1 dark:text-base01">
                {note.date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
                <span class="mx-2">&bull;</span>
                {note.read_time}
              </p>
            </A>
          </article>
        )}
      </For>

      <div class="mt-5 flex flex-row font-hubot text-sm font-semibold text-base1 dark:text-base01">
        <div class="rounded-md bg-base2 px-4 py-2 dark:bg-base02">
          <span class="mx-1">{notes()?.start}</span>
          <span>&dash;</span>
          <span class="mx-1">{Math.min(notes()?.end, notes()?.count)}</span>
          <span>of</span>
          <span class="mx-1">{notes()?.count}</span>
        </div>

        <Show when={notes()?.start > 1}>
          <a
            class="ml-2 rounded-md bg-base2 px-3 py-2 transition-all hover:text-base01 dark:bg-base02 dark:hover:text-base1"
            href={`?page=${parseInt(params.page ?? 1) - 1}`}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setParams({ page: parseInt(params.page ?? 1) - 1 });
            }}
          >
            &ShortLeftArrow;
          </a>
        </Show>

        <Show when={notes()?.end < notes()?.count}>
          <a
            class="ml-2 rounded-md bg-base2 px-3 py-2 transition-all hover:text-base01 dark:bg-base02 dark:hover:text-base1"
            href={`?page=${parseInt(params.page ?? 1) + 1}`}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setParams({ page: parseInt(params.page ?? 1) + 1 });
            }}
          >
            &RightArrow;
          </a>
        </Show>
      </div>
    </>
  );
}
