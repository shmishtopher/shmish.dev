import { redirect } from "solid-start"
import jwt from "jsonwebtoken"
import cookie from "cookie"

export async function GET({ request, fetch }) {
  // Let's start by parsing out the query parameters.  If
  // the `code` parameter is missing, we'll throw just
  // redirect to the guestbook early.
  const { searchParams } = new URL(request.url)

  if (!searchParams.get("code")) {
    throw redirect("/guestbook", 403)
  }

  // Now we'll exchange our code for a GitHub auth token.
  const body = {
    client_id: import.meta.env.VITE_GH_CLIENT_ID,
    client_secret: import.meta.env.VITE_GH_CLIENT_SECRET,
    code: searchParams.get("code"),
  }

  const ghToken = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(res => res.access_token)

  // Next, we need to use this access token to the the
  // user's display name.
  const {
    login,
    name,
    html_url: url,
  } = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghToken}`,
    },
  }).then(res => res.json())

  // Make sure auth went as expected
  if (!name) {
    throw redirect("/guestbook", 403)
  }

  // Now we just need to put the name and GitHub profile in
  // a claim and sign it.
  const token = jwt.sign(
    { login, name, url },
    import.meta.env.VITE_GUESTBOOK_SECRET,
    {
      expiresIn: 60 * 60 * 24 * 5,
    }
  )

  // Store the token in a cookie with a shorter expiration
  const cookieString = cookie.serialize("gh_user", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 60 * 4,
  })

  // Set the cookie and redirect back to the guestbook
  return redirect("/guestbook", {
    headers: { "Set-Cookie": cookieString },
  })
}
