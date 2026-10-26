'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import SectionLabel from '@/components/ui/SectionLabel'
import { blogPosts } from '@/lib/data'

const CATEGORY_COLORS: Record<string, string> = {
  'LLM Engineering': '#00D4FF',
  'AI Engineering':  '#b54832',
  'Full Stack':      '#00D48C',
}

/**
 * Blog — horizontal scrolling blog card row with excerpt and category tags.
 */
export default function Blog() {
  if (blogPosts.length === 0) return null

  return (
    <section id="blog" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        <SectionLabel number="07" label="Writing" />

        <div className="flex items-end justify-between gap-4 mt-6 mb-10">
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
          >
            Thoughts on AI engineering.
          </h2>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-sm"
            style={{ color: 'var(--accent-primary)' }}
          >
            All posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => {
            const color = CATEGORY_COLORS[post.category] ?? '#8892A4'
            return (
              <motion.article
                key={post.slug}
                className="gradient-border flex flex-col rounded-xl overflow-hidden group"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Color bar */}
                <div className="h-1 w-full" style={{ background: color }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono, monospace)',
                        color,
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold text-lg mb-3 flex-1 group-hover:text-accent-primary transition-colors"
                    style={{
                      fontFamily: 'var(--font-syne, sans-serif)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    className="text-sm mb-5 line-clamp-3"
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readingTime}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color }}
                    >
                      Read <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm"
            style={{ color: 'var(--accent-primary)' }}
          >
            View all posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
