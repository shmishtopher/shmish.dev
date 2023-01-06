import Link from "next/link"

export default function Footer() {
  return (
    <footer className="font-hubot py-8 my-10 flex flex-col md:flex-row md:justify-between border-solid border-base2 dark:border-base02 border-t-2 text-base00 dark:text-base0">
      <ul>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><Link href="/">Home</Link></li>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><Link href="/homework">Homework Help</Link></li>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><a href="mailto:me@shmish.dev">Contact</a></li>
      </ul>

      <ul>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><a href="https://github.com/shmishtopher">GitHub</a></li>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><a href="/404">YouTube</a></li>
      </ul>

      <ul>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><a href="/feed.xml">RSS Feed</a></li>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><a href="/sitemap.xml">Sitemap</a></li>
        <li className="mb-4 hover:text-base01 hover:dark:text-base1"><a href="https://github.com/shmishtopher/shmish.dev">Source</a></li>
      </ul>
    </footer>
  )
}