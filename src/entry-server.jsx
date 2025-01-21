// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
          <link rel="icon" type="image/png" href="/images/favicon.png" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Shmish's Notes"
            href="/rss.xml"
          />

          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="follow, index" />
          <meta
            name="author"
            content="Christopher K. Schmitt <me@shmish.dev>"
          />

          {assets}
        </head>
        <body class="bg-base3 dark:bg-base03">
          {children}
          {scripts}
        </body>
      </html>
    )}
  />
));
