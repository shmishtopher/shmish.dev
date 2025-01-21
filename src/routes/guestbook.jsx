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
import { getUser } from "~/lib/session";
import sql from "~/lib/database";

/**
 * Parse the form data and validate the user's claim. If
 * everything looks good, we will upload the user's message
 * to the database. We will throw an error if:
 * - The user is not authenticated
 * - the user submitted a message less than a minute ago
 * - The message is only whitespace
 * - The message is longer than 500 characters
 */
const signGuestbook = action(async data => {
  "use server";

  const userData = await getUser();

  if (!userData.valid) {
    throw new Error("Not authenticated.");
  }

  // Check to make sure the user is not spanning the
  // guestbook with too many messages
  const [{ exists: recentUpload }] = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM guestbook
      WHERE id = ${userData.id}
      AND timestamp >= NOW() - INTERVAL '1 minute'
    )
  `;

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
  await sql`
    INSERT INTO guestbook (timestamp, id, name, url, text)
    VALUES (
      NOW(), 
      ${userData.id}, 
      ${userData.name}, 
      ${userData.url}, 
      ${message.trim()}
    )
  `;

  // Reload the messages
  return reload({ revalidate: getMessages.key });
});

/**
 * Get a block of messages from the postgre database. This
 * function returns messages in a paged format, where each
 * page is 15 messages long.
 */
const getMessages = query(async (page = 1) => {
  "use server";

  if (page < 1) {
    throw new Error("Page must be greader than zero");
  }

  // Run queries to get messages
  const messagesQuery = sql`
    SELECT timestamp, name, url, text
    FROM guestbook
    ORDER BY timestamp DESC
    LIMIT 15 OFFSET ${(page - 1) * 15}
  `;

  const countQuery = sql`
    SELECT COUNT(*) AS count
    FROM guestbook
  `;

  const [messages, [{ count }]] = await Promise.all([
    messagesQuery,
    countQuery,
  ]);

  // Compute the metadata
  const start = count > 0 ? (page - 1) * 15 + 1 : 0;
  const end = Math.max(0, start + messages.length - 1);

  return { messages, count, start, end };
});

/**
 * Get the github client ID from the server.  This is not
 * a secret, and this endpoint exists to enable a single
 * codebase to work in both production and development.
 */
async function getClientId() {
  "use server";

  return process.env.GH_CLIENT_ID;
}

/**
 * A sign-in button to render when the user is not
 * authenticated.
 */
function SignInBtn() {
  const client_id = createAsync(getClientId, { deferStream: true });

  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${client_id()}`}
      class="mt-5 flex w-fit"
    >
      <button class="rounded-md bg-base2 px-8 py-2 font-hubot font-semibold text-base01 ring-blue transition-shadow hover:ring-2 dark:bg-base02 dark:text-base1">
        Sign in with GitHub
      </button>
    </a>
  );
}

export default function Guestbook() {
  const [params, setParams] = useSearchParams();
  const userData = createAsync(getUser, { deferStream: true });
  const messages = createAsync(() => getMessages(params.page ?? 1), {
    deferStream: true,
  });
  const submission = useSubmission(signGuestbook);

  return (
    <>
      <Title>Guestbook | shmish.dev</Title>

      <Meta name="description" content="Leave your mark! Sign the guestbook!" />

      <Meta
        name="og:description"
        content="Leave your mark! Sign the guestbook!"
      />

      <Meta name="og:title" content="Guestbook | shmish.dev" />
      <Meta name="og:url" content="https://shmish.dev/guestbook" />

      <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        Guestbook.
      </h1>

      <p class="mt-5 text-justify font-mona text-base00 dark:text-base0">
        Wordsmiths, poets, and internet trolls: I invite you to leave a message
        for future visitors of this site. Perhaps your country&apos;s flag, or
        maybe what you ate for lunch. Words of wisdom are always welcome. Click
        on a name to explore that user&apos;s GitHub profile!
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
            class="mr-3 w-full rounded-md bg-base2 px-4 py-2 text-base00 outline-none ring-blue placeholder:text-base1 focus:ring-2 dark:bg-base02 dark:text-base0 dark:placeholder:text-base01"
          />
          <input
            type="submit"
            value="Sign"
            disabled={submission.pending}
            class="cursor-pointer rounded-md bg-base2 px-8 py-2 font-hubot font-semibold text-base01 outline-none ring-blue focus:ring-2 disabled:cursor-wait disabled:opacity-70 dark:bg-base02 dark:text-base1"
          />
        </form>
      </Show>

      <Show when={submission.error}>
        <div class="mt-5 w-full rounded-md border-2 border-solid border-red px-4 py-2">
          <p class="text-red">Whoops! {submission.error.message}</p>
        </div>
      </Show>

      <For each={messages()?.messages}>
        {message => (
          <div class="mt-5 flex flex-col">
            <div class="flex flex-row font-hubot">
              <a
                href={message.url}
                class="mr-2 font-semibold text-base01 dark:text-base1"
              >
                {message.name}
              </a>
              <span class="text-base-1 mr-2 text-base1 dark:text-base01">
                &bull;
              </span>
              <span class="text-base-1 mr-2 text-base1 dark:text-base01">
                {message.timestamp.toLocaleString("en-US", {
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
            <span class="font-mona text-base00 dark:text-base0">
              {message.text}
            </span>
          </div>
        )}
      </For>

      <div class="mt-5 flex flex-row font-hubot text-sm font-semibold text-base1 dark:text-base01">
        <div class="rounded-md bg-base2 px-4 py-2 dark:bg-base02">
          <span class="mx-1">{messages()?.start}</span>
          <span>&dash;</span>
          <span class="mx-1">
            {Math.min(messages()?.end, messages()?.count)}
          </span>
          <span>of</span>
          <span class="mx-1">{messages()?.count}</span>
        </div>

        <Show when={messages()?.start > 1}>
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

        <Show when={messages()?.end < messages()?.count}>
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
