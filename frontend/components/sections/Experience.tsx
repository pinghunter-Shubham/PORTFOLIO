'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'
import { experiences } from '@/lib/data'

/**
 * Experience — vertical scroll-animated timeline with animated dot + cyan line.
 */
export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="experience"
      className="section-padding"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="section-container">
        <SectionLabel number="05" label="Experience" />

        <h2
          className="font-display font-bold mt-6 mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
        >
          Where I&apos;ve worked.
        </h2>

        <div ref={containerRef} className="relative pl-8 md:pl-12">
          {/* Animated vertical line */}
          <div
            className="absolute left-0 md:left-4 top-0 bottom-0 w-px"
            style={{ background: 'var(--border-subtle)' }}
          />
          <motion.div
            className="absolute left-0 md:left-4 top-0 w-px origin-top"
            style={{
              background: 'var(--accent-primary)',
              height: lineHeight,
              boxShadow: '0 0 10px var(--accent-primary)',
            }}
          />

          <div className="space-y-14">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute -left-[41px] md:-left-[53px] top-1 w-4 h-4 rounded-full"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--accent-primary)',
                    boxShadow: '0 0 12px var(--accent-glow)',
                  }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                />

                {/* Card */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                    <div>
                      <h3
                        className="font-bold text-lg"
                        style={{
                          fontFamily: 'var(--font-syne, sans-serif)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {exp.role}
                      </h3>
                      <p
                        className="text-sm font-medium mt-0.5"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full shrink-0"
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono, monospace)',
                        color: 'var(--text-tertiary)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {exp.description.map((point, pi) => (
                      <li
                        key={pi}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
                      >
                        <span
                          className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: 'var(--accent-primary)' }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
