export default function RepoCard({ name, description, language, html_url }) {
  return (
    <a href={html_url}>
      <div className="p-4 bg-base2 dark:bg-base02 rounded-md hover:ring-2 ring-blue transition-shadow">
        <h1 className="flex flex-row items-center font-hubot font-semibold text-xl text-base01 dark:text-base1">
          {name}
          <span className="lang align-middle" data-language={language}>{language}</span>
        </h1>
        
        <p className="font-mona text-base00 dark:text-base0">{description}</p>
      </div>
    </a>
  )
}