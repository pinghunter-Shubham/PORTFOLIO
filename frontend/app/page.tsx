import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import AIDemo from '@/components/sections/AIDemo'
import Blog from '@/components/sections/Blog'
import Contact from '@/components/sections/Contact'

/**
 * Home page — single-page portfolio, all sections stacked vertically.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <AIDemo />
      <Blog />
      <Contact />
    </>
  )
}
