import {
  createServerData$,
  createServerAction$,
  HttpHeader,
} from "solid-start/server"
import { FormError } from "solid-start/data"
import { Show, For, Suspense } from "solid-js"
import { useSearchParams, redirect, Title, Meta } from "solid-start"
import cookie from "cookie"
import jwt from "jsonwebtoken"
import Redis from "ioredis"

// Configure our redis client
const redis = new Redis(import.meta.env.VITE_GUESTBOOK_REDIS)

/**
 * Get a block of messages from the redis database.  This
 * function returns messages in a paged format, where each
 * page is 15 messages long.
 */
async function getMessagesPaged(page = 1) {
  // Start by computing the start and end of the page
  const pageSize = 15
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  // Fetch messages in reverse order, then parse them.
  const messages = await redis.lrange("messages", start, end)
  return { start, end, messages: messages.map(JSON.parse) }
}

/**
 * Read the request cookie to determine if the user has a
 * valid login claim.
 */
function getAuthenticated(_, { request }) {
  // Get the cookie from the request headers
  const cookieString = request.headers.get("Cookie") ?? ""
  const { gh_user } = cookie.parse(cookieString)

  // Attempt to verify the JWT signiture and TTL.  If
  // either of these are invalid, or the cookie is unset,
  // we will return false
  try {
    jwt.verify(gh_user, import.meta.env.VITE_GUESTBOOK_SECRET)
  } catch {
    return false
  }

  // The user claim is valid
  return true
}

/**
 * Parse the form data and validate the user's claim.  If
 * everything looks good, we will upload the user's message
 * to the redis database.  We will throw an error if:
 * - The user is not authenticated
 * - the user submitted a message less than a minute ago
 * - The message is only whitespace
 * - The message is longer than 500 characters
 */
async function submitMessage(formData, { request }) {
  // Get the cookie from the request data
  const cookieString = request.headers.get("Cookie") ?? ""
  const { gh_user } = cookie.parse(cookieString)

  // Attempt to verify the JWT signiture and extract the
  // claim to function scope.
  try {
    var { name, url, login } = jwt.verify(
      gh_user,
      import.meta.env.VITE_GUESTBOOK_SECRET
    )
  } catch {
    throw new FormError("Not authenticated.")
  }

  // Check to make sure the user is not uploading too many
  // messages
  const lastUpload = (await redis.hget("last_message", login)) ?? 0

  if (Date.now() - lastUpload < 1000 * 60) {
    throw new FormError("Wait at least one minute between messages")
  }

  // Now we'll exctract the message from the form and
  // validate its length
  const text = formData.get("message")

  if (text.length > 500) {
    throw new FormError("Message must be < 500 characters.")
  }

  if (text.trim().length === 0) {
    throw new FormError("Message must not be empty.")
  }

  // Add the message to the database
  const date = Date.now()
  const value = JSON.stringify({ name, url, text, date })

  await Promise.all([
    redis.lpush("messages", value),
    redis.hset("last_message", login, date),
  ])

  // Return the user to the guestbook
  return redirect("/guestbook")
}

/**
 * Take a timestamp and format it in a human-readable
 * format (eg. Sun Jun 04, 2023 04:29:28 PM)
 */
function formatDate(timestamp) {
  const date = new Date(timestamp)

  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

/**
 * A sign-in button to render when the user is not
 * authenticated.
 */
function SignInBtn() {
  return (
    <a
      href="https://github.com/login/oauth/authorize?client_id=ee51a857a2ad6552e5b7"
      class="mt-5 flex w-fit"
    >
      <button class="rounded-md bg-base2 px-8 py-2 font-hubot font-semibold text-base01 ring-blue transition-shadow hover:ring-2 dark:bg-base02 dark:text-base1">
        Sign in with GitHub
      </button>
    </a>
  )
}

export default function Guestbook() {
  const [params, setParams] = useSearchParams()
  const loggedIn = createServerData$(getAuthenticated)
  const messages = createServerData$(getMessagesPaged, {
    key: () => parseInt(params.page ?? 1),
  })
  const msgCount = createServerData$(() => redis.llen("messages"))
  const [posting, { Form }] = createServerAction$(submitMessage)

  return (
    <>
      <Title>Guestbook - shmish.dev</Title>
      <Meta name="description" content="Leave your mark! Sign the guestbook!" />
      <Meta name="og:title" content="Guestbook - shmish.dev" />
      <Meta
        name="og:description"
        content="Leave your mark!  Sign the guestbook!"
      />
      <Meta name="og:url" content="https://shmish.dev/guestbook" />
      <HttpHeader name="Cache-Control" value="no-cache" />

      <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        Guestbook.
      </h1>

      <p class="mt-5 font-mona text-base00 dark:text-base0">
        Wordsmiths, poets, and internet trolls: I invite you to leave a message
        for future visitors of this site. Perhaps your country&apos;s flag, or
        maybe what you ate for lunch. Wise words of wisdom are always welcome.
        Click on a name to explore that user&apos;s GitHub profile!
      </p>

      <Show when={loggedIn()} fallback={SignInBtn()}>
        <Form class="mt-5 flex w-full flex-row">
          <input
            type="text"
            name="message"
            placeholder="Message..."
            class="mr-3 w-full rounded-md bg-base2 px-4 py-2 text-base00 outline-none ring-blue placeholder:text-base1 focus:ring-2 dark:bg-base02 dark:text-base0 dark:placeholder:text-base01"
          />
          <input
            type="submit"
            value="Sign"
            disabled={posting.pending}
            class="cursor-pointer rounded-md bg-base2 px-8 py-2 font-hubot font-semibold text-base01 outline-none ring-blue focus:ring-2 dark:bg-base02 dark:text-base1"
          />
        </Form>
      </Show>

      <Show when={posting.error}>
        <div class="mt-5 w-full rounded-md border-2 border-solid border-red px-4 py-2">
          <p class="text-red">Whoops! {posting.error?.message}</p>
        </div>
      </Show>

      <Suspense
        fallback={
          <p class="mt-5 font-hubot font-semibold text-base01 dark:text-base1">
            Loading messages...
          </p>
        }
      >
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
                  {formatDate(message.date)}
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
            <span class="mx-1">{messages()?.start + 1}</span>
            <span>&dash;</span>
            <span class="mx-1">
              {Math.min(messages()?.end + 1, msgCount())}
            </span>
            <span>of</span>
            <span class="mx-1">{msgCount()}</span>
          </div>

          <Show when={messages()?.start > 0}>
            <a
              class="ml-2 rounded-md bg-base2 px-3 py-2 transition-all hover:text-base01 dark:bg-base02 dark:hover:text-base1"
              href={`?page=${parseInt(params.page ?? 1) - 1}`}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setParams({ page: parseInt(params.page ?? 1) - 1 })
              }}
            >
              &ShortLeftArrow;
            </a>
          </Show>

          <Show when={messages()?.end < msgCount()}>
            <a
              class="ml-2 rounded-md bg-base2 px-3 py-2 transition-all hover:text-base01 dark:bg-base02 dark:hover:text-base1"
              href={`?page=${parseInt(params.page ?? 1) + 1}`}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setParams({ page: parseInt(params.page ?? 1) + 1 })
              }}
            >
              &RightArrow;
            </a>
          </Show>
        </div>
      </Suspense>
    </>
  )
}
