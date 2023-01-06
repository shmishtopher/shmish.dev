import Container from "/components/Container"

export default function index({ notes }) {
  const meta = {
    title: "Notes - shmish.dev",
    description: "Thoughts on tech, policy, and computer science."
  }

  return (
    <Container {...meta}>
      <h1 className="font-hubot font-semibold text-3xl text-base01 dark:text-base1">Notes.</h1>
      <p className="font-mona text-base00 dark:text-base0 text-center mt-8">
        Under construction. 
        <br /> 
        Use your favorite RSS aggregator to subscribe to updates.
      </p>
    </Container>
  )
}
