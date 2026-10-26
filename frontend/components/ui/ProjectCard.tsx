'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '@/lib/data'

interface ProjectCardProps {
  project: Project
}

const CATEGORY_COLORS: Record<Project['category'], string> = {
  'ML / AI':        'var(--accent-primary)',
  'Computer Vision':'var(--accent-secondary)',
  'Python':         'var(--success)',
  'IoT / Embedded': 'var(--warning)',
  'Research':       '#b54832',
  'Software':       'var(--text-tertiary)',
}

/**
 * ProjectCard — displays a project with tech pills, links, and hover animations.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const accentColor = CATEGORY_COLORS[project.category]

  return (
    <motion.article
      className="gradient-border rounded-xl h-full flex flex-col"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: accentColor,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {project.category}
          </span>

          {project.featured && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                color: 'var(--warning)',
                background: 'rgba(255,179,64,0.1)',
                border: '1px solid rgba(255,179,64,0.25)',
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
              }}
            >
              ★ featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'var(--font-syne, sans-serif)', color: 'var(--text-primary)' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm mb-4 flex-1"
          style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}
        >
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-md"
              style={{
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                color: 'var(--text-secondary)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {((project.github && project.github !== '#') || (project.demo && project.demo !== '#')) && (
          <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {project.github && project.github !== '#' && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Github size={14} /> Source
              </a>
            )}
            {project.demo && project.demo !== '#' && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <ExternalLink size={14} /> Live project
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}
