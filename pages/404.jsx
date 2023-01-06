import Link from "next/link"
import Container from "/components/Container"



export default function NotFound() {
  return (
    <Container title="Not Found - Shmish.dev">
      <div className="text-center">
        <h1 className="font-hubot font-semibold text-3xl text-base01 dark:text-base1">418 - I'm a teapot</h1>
        <p className="font-mona text-base00 dark:text-base0 mt-8">
          Just kidding, you've actaully stumbled into my 404 page.  It looks
          like the page you're trying to get to no longer exists.  Perhaps it 
          never did.  Let's get you back <Link href="/" className="link text-blue">home.</Link>
        </p>
        <p className="font-mona text-base00 dark:text-base0 mt-8">
          Alternativly, you can take this opportunity read <a href="https://www.rfc-editor.org/rfc/rfc2324" className="link text-blue">RFC 2324,</a> the
          document that defines the <a href="https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol" className="link text-blue">Hyper Text Coffee Pot Control Protocol.</a>
        </p>

        <div className="prose dark:prose-invert mt-8">
          <figure>
            <blockquote>
              Any attempt to brew coffee with a teapot should result in the 
              error code "418 I'm a teapot". The resulting entity body MAY be 
              short and stout.
            </blockquote>
            <figcaption>RFC 2324 § 2.3.2</figcaption>
          </figure>
        </div>
      </div>
    </Container>
  )
}
