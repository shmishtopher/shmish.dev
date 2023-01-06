import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Moon from "/public/svg/moon.svg"
import Sun from "/public/svg/sun.svg"


function NavItem({ href, text }) {
  const router = useRouter()
  const active = router.asPath === href

  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 hover:bg-base2 dark:hover:bg-base02 font-hubot">
      <span className={active 
        ? "font-bold text-base01 dark:text-base1" 
        : "font-normal text-base00 dark:text-base0"}>
        {text}
      </span>
    </Link>
  )
}

function Toggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => theme === "dark"
    ? setTheme("light")
    : setTheme("dark")

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="h-9 w-9 flex justify-center items-center ml-auto rounded-md text-base01 dark:text-base1 hover:bg-base2 dark:hover:bg-base02">

      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  )
}

export default function Header() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), []);
  
  return (
    <ul className="-left-3 relative mt-6 mb-8 flex flex-row items-center">
      <NavItem href="/" text="Home" />
      <NavItem href="/labs" text="Labs" />
      <NavItem href="/notes" text="Notes" />
      {mounted && <Toggle />}
    </ul>
  )
}