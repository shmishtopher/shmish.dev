import sql from "~/lib/database";

export async function GET({ request }) {
  const { searchParams } = new URL(request.url);

  const assets = await sql`
    SELECT
      asset ->> 'blob' AS blob,
      asset ->> 'mime' AS mime
    FROM
      notes,
      jsonb_array_elements(assets) as asset
    WHERE
      path = ${searchParams.get("path")}
    AND
      asset ->> 'name' = ${searchParams.get("name")}
  `;

  if (assets.length === 0) {
    throw new Error("Asset not found");
  }

  const { blob, mime } = assets.at(0);
  const decoded = Buffer.from(blob, "base64");

  return new Response(decoded, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": decoded.length.toString(),
    },
  });
}
