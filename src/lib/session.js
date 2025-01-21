"use server";

import { useSession } from "vinxi/http";

export function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET,
  });
}

export async function getUser() {
  const session = await getSession();

  return session.data;
}
