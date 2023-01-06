import Container from "/components/Container"
import RepoCard from "/components/RepoCard"


export default function homework({ repos }) {
  const meta = {
    title: "Homework Help - shmish.dev",
    description: "Notes and assignments for the CCSU computer science program"
  }

  return (
    <Container {...meta}>
      <h1 className="font-hubot font-semibold text-3xl text-base01 dark:text-base1">Homework Help.</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-6">
        {repos.map((repo, i) => <RepoCard key={i} {...repo} />)}
      </div>
    </Container>
  )
}

export async function getStaticProps() {
  const repos = await Promise.all([
    fetch("https://api.github.com/repos/shmishtopher/CS-253").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-355").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-354").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-254").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-153").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-385").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-483").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-492").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/CS-463").then(x => x.json()),
    fetch("https://api.github.com/repos/shmishtopher/Semantic-Web").then(x => x.json()),
  ])
  
  return {
    props: { repos },
    revalidate: 600,
  }
}
