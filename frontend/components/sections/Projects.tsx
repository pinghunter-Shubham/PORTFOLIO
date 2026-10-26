'use client'

import { useState } from 'react'
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
  'Software',
]

export default function Projects({ autoProjects = [] }: { autoProjects?: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All')
  const combined = [
    ...projects.filter((project) => project.github.startsWith('https://github.com/')),
    ...autoProjects.filter((autoProject) => !projects.some((project) => project.github === autoProject.github)),
  ]
  const filtered = activeFilter === 'All'
    ? combined
    : combined.filter((project) => project.category === activeFilter)

  return (
    <section id="projects" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container">
        <SectionLabel number="04" label="Projects" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6 mb-10">
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
            Things I&apos;ve built.
          </h2>
          <div className="flex flex-wrap gap-2" aria-label="Filter projects">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={isActive}
                  className="px-4 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  }}
                >
                  {filter}
                </button>
              )
            })}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </div>
    </section>
  )
}
