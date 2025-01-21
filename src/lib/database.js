"use server";

import postgres from "postgres";

const sql = postgres({
  host: "postgres",
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

export default sql;
