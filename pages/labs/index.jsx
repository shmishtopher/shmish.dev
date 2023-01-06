import Container from "/components/Container"

export default function index({ labs }) {
  const meta = {
    title: "Labs - shmish.dev",
    description: "Open source hardware and software.  Free forever."
  }

  return (
    <Container {...meta}>
      <h1 className="font-hubot font-semibold text-3xl text-base01 dark:text-base1">Labs.</h1>
      <p className="font-mona text-base00 dark:text-base0 text-center mt-8">
        Under construction. 
        <br /> 
        Use your favorite RSS aggregator to subscribe to updates.
      </p>
    </Container>
  )
}
