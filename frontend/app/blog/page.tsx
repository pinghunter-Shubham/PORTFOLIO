import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Blog — AI Engineering Insights',
  description: 'In-depth articles on LLM engineering, RAG pipelines, and full-stack AI development.',
}

const CATEGORY_COLORS: Record<string, string> = {
  'LLM Engineering': '#b54832',
  'AI Engineering':  '#b54832',
  'Full Stack':      '#61795f',
}

/**
 * Blog listing page — all posts in a vertical list.
 * Uses CSS-only hover (no inline JS handlers) so the page stays a Server Component.
 */
export default function BlogPage() {
  if (blogPosts.length === 0) notFound()

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container max-w-3xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={14} />
          Back to portfolio
        </Link>

        {/* Header */}
        <p
          className="text-xs mb-4 tracking-widest uppercase"
          style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: 'var(--accent-primary)',
          }}
        >
          {'//'} 07&nbsp;&nbsp;WRITING
        </p>
        <h1
          className="font-display font-bold mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
        >
          All Posts
        </h1>
        <p className="mb-12 text-base" style={{ color: 'var(--text-secondary)' }}>
          Deep dives on LLM engineering, production AI systems, and full-stack development.
        </p>

        {/* Post list */}
        <div className="space-y-6">
          {blogPosts.map((post) => {
            const color = CATEGORY_COLORS[post.category] ?? '#8892A4'
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article
                  className="p-6 rounded-xl border transition-all duration-200 hover:border-[rgba(0,212,255,0.3)]"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
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
                    <div
                      className="flex items-center gap-3 text-xs"
                      style={{
                        color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-jetbrains-mono, monospace)',
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {post.readingTime}
                      </span>
                    </div>
                  </div>

                  <h2
                    className="font-bold text-xl mb-2 group-hover:text-[#b54832] transition-colors"
                    style={{
                      fontFamily: 'var(--font-syne, sans-serif)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {post.title}
                  </h2>

                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
                  >
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
