import "/public/styles/globals.css"

import font from "@next/font/local"
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from "next-themes"


const monaSans = font({
  src: "../public/fonts/Mona-Sans.woff2", 
  variable: "--font-mona" 
})

const hubotSans = font({ 
  src: "../public/fonts/Hubot-Sans.woff2", 
  variable: "--font-hubot" 
})

const fonts = `${monaSans.variable} ${hubotSans.variable} font-mona font-hubot`

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <main className={fonts}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </ThemeProvider>
  )
}
