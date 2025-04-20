"use server";

import { useSession } from "vinxi/http";

// Extract the encrypted user session from the current
// request context.
export function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET,
  });
}

// Grab the current user out of the session if the user has
// been authenticated.
export async function getUser() {
  const session = await getSession();

  return session.data;
}
