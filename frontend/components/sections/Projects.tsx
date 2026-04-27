'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'
import ProjectCard from '@/components/ui/ProjectCard'
import { projects, type Project } from '@/lib/data'

const FILTERS: Array<'All' | Project['category']> = [
  'All',
  'ML / AI',
  'Computer Vision',
  'Python',
  'Research',
  'IoT / Embedded',
]

/**
 * Projects — filter tabs + masonry-style project card grid.
 */
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>('All')

  const filtered =
    activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container">
        <SectionLabel number="04" label="Projects" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6 mb-10">
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
          >
            Things I&apos;ve built.
          </h2>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter
              return (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: isActive ? '#080B0F' : 'var(--text-secondary)',
                    border: isActive
                      ? '1px solid var(--accent-primary)'
                      : '1px solid var(--border-subtle)',
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {filter}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard
                  project={project}
                  onDemoClick={() => {
                    document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
