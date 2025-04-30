// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
          <link rel="icon" sizes="16x16" type="image/png" href="/images/favicon-16.png" />
          <link rel="icon" sizes="32x32" type="image/png" href="/images/favicon-32.png" />
          <link rel="icon" sizes="180x180" type="image/png" href="/images/favicon-180.png" />
          <link rel="icon" sizes="192x192" type="image/png" href="/images/favicon-192.png" />
          <link rel="icon" sizes="512x512" type="image/png" href="/images/favicon-512.png" />
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
