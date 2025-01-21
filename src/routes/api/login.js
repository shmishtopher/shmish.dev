import { redirect } from "@solidjs/router";
import { getSession } from "~/lib/session";

export async function GET({ request }) {
  // Let's start by parsing out the query parameters.  If
  // the `code` parameter is missing, we'll throw just
  // redirect to the guestbook early.
  const { searchParams } = new URL(request.url);

  if (!searchParams.get("code")) {
    throw redirect("/guestbook", 403);
  }

  // Now we'll exchange our code for a GitHub auth token.
  const body = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_CLIENT_SECRET,
    code: searchParams.get("code"),
  };

  const ghToken = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(res => res.access_token);

  // Next, we need to use this access token to the the
  // user's profile data.
  const ghProfile = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghToken}`,
    },
  }).then(res => res.json());

  // Make sure auth went as expected
  if (!ghProfile.name) {
    throw redirect("/guestbook", 403);
  }

  // Store the github profile in the user session
  const session = await getSession();
  await session.update(() => ({
    id: ghProfile.id,
    name: ghProfile.name,
    url: ghProfile.html_url,
    valid: true,
  }));

  // Return to the guestbook
  return redirect("/guestbook");
}
