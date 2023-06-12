/**
 * A card that displays a github repository.  Includes the
 * name, description, language, and provides a link.
 */
export default function RepoCard({ name, description, language, html_url }) {
  return (
    <a href={html_url}>
      <div className="rounded-md bg-base2 p-4 ring-blue transition-shadow hover:ring-2 dark:bg-base02">
        <h1 className="flex flex-row items-center font-hubot text-xl font-semibold text-base01 dark:text-base1">
          {name}
          <span className="lang align-middle" data-language={language}>
            {language}
          </span>
        </h1>

        <p className="font-mona text-base00 dark:text-base0">{description}</p>
      </div>
    </a>
  )
}
