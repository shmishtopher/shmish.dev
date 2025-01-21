import { Title, Meta } from "@solidjs/meta";
import { createAsync, useParams } from "@solidjs/router";
import { marked } from "marked";
import markedFootnote from "marked-footnote";
import { gfmHeadingId } from "marked-gfm-heading-id";
import sql from "~/lib/database";

async function getNote(note) {
  "use server";

  const response = await sql`
    SELECT title, dek, date, content
    FROM notes
    WHERE path = ${note}
  `;

  if (response.length === 0) {
    throw new Error("Entry does not exist");
  }

  return response.at(0);
}

export default function Note() {
  const params = useParams();
  const note = createAsync(() => getNote(params.note), { deferStream: true });

  // Register markdown plugins
  marked.use(gfmHeadingId());
  marked.use(markedFootnote());

  return (
    <article>
      <Title>{note()?.title}</Title>

      <Meta name="description" content={note()?.dek} />
      <Meta name="og:description" content={note()?.dek} />
      <Meta name="og:title" content={note()?.title} />
      <Meta name="og:type" content="article" />
      <Meta name="og:url" content={`https://shmish.dev/${params.note}`} />

      <h1 class="font-hubot text-3xl font-semibold text-base01 dark:text-base1">
        {note()?.title}
      </h1>
      <p class="mb-6 mt-3 font-hubot text-base1 dark:text-base01">
        {note()?.date?.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })}
      </p>

      <div
        class="prose text-justify dark:prose-invert"
        innerHTML={marked.parse(note()?.content ?? "")}
      />
    </article>
  );
}
