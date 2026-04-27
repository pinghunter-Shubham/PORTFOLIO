'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import SectionLabel from '@/components/ui/SectionLabel'
import { skills, type Skill } from '@/lib/data'

const SkillGraph = dynamic(() => import('@/components/ui/SkillGraph'), { ssr: false })

const GROUP_COLORS: Record<Skill['group'], string> = {
  'AI / ML':   '#00D4FF',
  'Frontend':  '#7B61FF',
  'Backend':   '#00D48C',
  'Tools':     '#8892A4',
}

/**
 * Skills — D3-style skill constellation graph + mobile pill fallback.
 */
export default function Skills() {
  return (
    <section id="skills" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        <SectionLabel number="03" label="Skills" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-6 mb-10">
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
              maxWidth: 480,
            }}
          >
            The tools I reach for.
          </h2>
          <p
            className="text-sm max-w-xs"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            Hover any node to see proficiency and context. Node size ∝ mastery level.
          </p>
        </div>

        {/* Constellation graph — desktop */}
        <motion.div
          className="hidden md:block rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <SkillGraph />
        </motion.div>

        {/* Mobile pill tags */}
        <div className="md:hidden space-y-6 mt-4">
          {(Object.keys(GROUP_COLORS) as Skill['group'][]).map((group) => (
            <div key={group}>
              <p
                className="text-xs mb-3 font-medium"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  color: GROUP_COLORS[group],
                }}
              >
                // {group}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.group === group)
                  .map((skill) => (
                    <motion.span
                      key={skill.id}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: `${GROUP_COLORS[group]}15`,
                        color: GROUP_COLORS[group],
                        border: `1px solid ${GROUP_COLORS[group]}30`,
                        fontFamily: 'var(--font-jetbrains-mono, monospace)',
                      }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
