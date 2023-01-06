import Typewriter from "/components/Typewriter"
import Glob from "/public/svg/glob.svg"
import Name from "/public/svg/name.svg"
import Container from "/components/Container"
import RepoCard from "/components/RepoCard"


export default function Home({ repos }) {
  const skills = [
    "JavaScript Junkie",
    "Haskell Hacker",
    "Elixir Enthusiast",
    "C/C++ Connoisseur",
    "Rust Radical",
  ]

  return (
    <Container>
      <section className="flex flex-col-reverse md:flex-row">
        <div className="md:max-w-[60%]">
          <h1 className="font-hubot font-semibold text-3xl text-base01 dark:text-base1">
            Hello,
            <br />
            my name is <Name className="inline h-7 align-baseline" />
          </h1>

          <p className="font-hubot font-semibold mt-2 text-base01 dark:text-base1 text-sm md:text-base">
            Programmer, Designer, <Typewriter strings={skills} />
          </p>

          <p className="font-mona mt-5 text-base00 dark:text-base0">
            I'm a software engineer and maker of things who's currently building ML
            models to accelerate drug discovery with <a className="link text-blue" href="https://www.bioxceltherapeutics.com/">BioXcel Therapeutics.</a> 
          </p>

          <p className="font-mona mt-5 text-base00 dark:text-base0">
            Looking to get in touch? Email me at <a className="link text-blue" href="mailto:me@shmish.dev">me@shmish.dev</a> and
            take a look at my <a className="link text-blue" href="/docs/cv.pdf">CV.</a>
          </p>
        </div>

        <Glob className="mx-auto md:mr-0 md:ml-auto min-w-[33%]" />
      </section>

      <section className="flex flex-col mt-16">
        <h1 className="font-hubot font-semibold text-3xl text-base01 dark:text-base1">Latest Work.</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-6">
          {repos.map((repo, i) => <RepoCard key={i} {...repo} />)}
        </div>
      </section>
    </Container>
  )
}

export async function getStaticProps() {
  const repos = await fetch("https://api.github.com/users/shmishtopher/repos?sort=created&type=owner")
    .then(res => res.json())
    .then(res => res.slice(0, 6))
  
  return {
    props: { repos },
    revalidate: 300,
  }
}
