import { Title, Meta } from "@solidjs/meta";
import {
  action,
  useSubmission,
  createAsync,
  query,
  reload,
  useSearchParams,
} from "@solidjs/router";
import { Show } from "solid-js";
import db from "~/lib/database";
import { getUser } from "~/lib/session";

// Parse the form data and validate the user's claim. If
// everything looks good, we will upload the user's message
// to the database. We will throw an error if:
// - The user is not authenticated
// - the user submitted a message less than a minute ago
// - The message is only whitespace
// - The message is longer than 500 characters
const signGuestbook = action(async data => {
  "use server";

  const userData = await getUser();

  if (!userData.valid) {
    throw new Error("Not authenticated.");
  }

  // Check to make sure the user is not spanning the
  // guestbook with too many messages
  const { recentUpload } = await db.get(
    `
    SELECT EXISTS (
      SELECT 1
      FROM guestbook
      WHERE id = ?
      AND timestamp >= datetime('now', '-1 minute')
    ) AS recentUpload
  `,
    userData.id
  );

  if (recentUpload) {
    throw new Error("Wait at least one minute between messages.");
  }

  // Now we'll extract the message from the form and
  // validate its length
  const message = data.get("message");

  if (message.length > 500) {
    throw new Error("Message must be less than 500 characters.");
  }

  if (message.trim().length === 0) {
    throw new Error("Message must not be empty.");
  }

  // Add the message to the database
  await db.run(
    `
    INSERT INTO guestbook (timestamp, id, name, url, message)
    VALUES (datetime('now'), :id, :name, :url, :message)
  `,
    {
      ":id": userData.id,
      ":name": userData.name,
      ":url": userData.url,
      ":message": message.trim(),
    }
  );

  // Reload the messages
  return reload({ revalidate: getEntries.key });
});

// Get a block of messages from the postgre database. This
// function returns messages in a paged format, where each
// page is 15 messages long.
const getEntries = query(async (page = 1) => {
  "use server";

  if (page < 1) {
    throw new Error("Page must be greater than zero");
  }

  // Define some pagination constants
  const limit = 15;
  const offset = (page - 1) * limit;

  // Get a page of messages
  const entries = await db.all(
    `
    SELECT timestamp, name, url, message
    FROM guestbook
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?    
  `,
    limit,
    offset
  );

  // Count the total number of messages
  const { count } = await db.get(`
    SELECT COUNT(*) AS count
    FROM guestbook
  `);

  // Compute the metadata
  const start = count > 0 ? offset + 1 : 0;
  const end = Math.min(count, start + entries.length - 1);

  return { entries, count, start, end };
});

// Get the github client ID from the server.  This is not
// a secret, and this endpoint exists to enable a single
// codebase to work in both production and development.
async function getClientId() {
  "use server";

  return process.env.GH_CLIENT_ID;
}

// A sign-in button to render when the user is not
// authenticated.
function SignInBtn() {
  const client_id = createAsync(getClientId);

  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${client_id()}`}
      class="mt-5 flex w-fit"
    >
      <button class="bg-base2 text-base01 ring-blue dark:bg-base02 dark:text-base1 rounded-md px-8 py-2 font-sans font-semibold transition-shadow hover:ring-2">
        Sign in with GitHub
      </button>
    </a>
  );
}

// The guestbook page. This needs to check the
// authentication state of the user and handle guestbook
// signing functionality.
export default function Guestbook() {
  const [params, setParams] = useSearchParams();
  const userData = createAsync(getUser);
  const entries = createAsync(() => getEntries(params.page ?? 1));
  const submission = useSubmission(signGuestbook);

  return (
    <>
      <Title>Guestbook | shmish.dev</Title>

      <Meta name="description" content="Sign the guestbook!" />
      <Meta name="og:description" content="Sign the guestbook!" />
      <Meta name="og:title" content="Guestbook | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/guestbook" />

      <h1 class="text-base01 dark:text-base1 font-serif text-4xl">
        Guestbook.
      </h1>

      <p class="text-base00 dark:text-base0 mt-5 text-justify font-sans">
        Wordsmiths, poets, and internet trolls: I invite you to leave a message
        for future visitors of this site. Perhaps your country&apos;s flag, or
        maybe what you ate for lunch. Click on a name to explore that
        user&apos;s GitHub profile!
      </p>

      <Show when={userData()?.valid} fallback={<SignInBtn />}>
        <form
          action={signGuestbook}
          method="post"
          class="mt-5 flex w-full flex-row"
        >
          <input
            type="text"
            name="message"
            placeholder="Message..."
            class="bg-base2 text-base00 ring-blue placeholder:text-base1 dark:bg-base02 dark:text-base0 dark:placeholder:text-base01 mr-3 w-full rounded-md px-4 py-2 outline-none focus:ring-2"
          />
          <input
            type="submit"
            value="Sign"
            disabled={submission.pending}
            class="bg-base2 text-base01 ring-blue dark:bg-base02 dark:text-base1 cursor-pointer rounded-md px-8 py-2 font-sans font-semibold outline-none focus:ring-2 disabled:cursor-wait disabled:opacity-70"
          />
        </form>
      </Show>

      <Show when={submission.error}>
        <div class="border-red mt-5 w-full rounded-md border-2 border-solid px-4 py-2">
          <p class="text-red">Whoops! {submission.error.message}</p>
        </div>
      </Show>

      <For each={entries()?.entries}>
        {entry => (
          <div class="mt-5 flex flex-col">
            <div class="flex flex-row font-sans">
              <a
                href={entry.url}
                class="text-base01 dark:text-base1 mr-2 font-semibold"
              >
                {entry.name}
              </a>
              <span class="text-base-1 text-base1 dark:text-base01 mr-2">
                &bull;
              </span>
              <span class="text-base-1 text-base1 dark:text-base01 mr-2">
                {new Date(entry.timestamp).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <span class="text-base00 dark:text-base0 font-sans">
              {entry.message}
            </span>
          </div>
        )}
      </For>

      <div class="text-base1 dark:text-base01 mt-5 flex flex-row font-sans text-sm font-semibold">
        <div class="bg-base2 dark:bg-base02 rounded-md px-4 py-2">
          <span class="mx-1">{entries()?.start}</span>
          <span>&dash;</span>
          <span class="mx-1">{Math.min(entries()?.end, entries()?.count)}</span>
          <span>of</span>
          <span class="mx-1">{entries()?.count}</span>
        </div>

        <Show when={entries()?.start > 1}>
          <a
            class="bg-base2 hover:text-base01 dark:bg-base02 dark:hover:text-base1 ml-2 rounded-md px-3 py-2 transition-all"
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

        <Show when={entries()?.end < entries()?.count}>
          <a
            class="bg-base2 hover:text-base01 dark:bg-base02 dark:hover:text-base1 ml-2 rounded-md px-3 py-2 transition-all"
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

// Define a preload method on this route so that we start
// loading entries from the guestbook database as early as
// possible
export const route = {
  preload: getEntries,
};
