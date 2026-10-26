import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import AIDemo from '@/components/sections/AIDemo'
import Blog from '@/components/sections/Blog'
import Contact from '@/components/sections/Contact'
import { getAutoProjects } from '@/lib/github-projects'

/**
 * Home page — single-page portfolio, all sections stacked vertically.
 */
export default async function Home() {
  const autoProjects = await getAutoProjects()
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects autoProjects={autoProjects} />
      <Experience />
      <AIDemo />
      <Blog />
      <Contact />
    </>
  )
}
